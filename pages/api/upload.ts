import { NextApiRequest, NextApiResponse } from "next";
import { Fields, Files } from "formidable";
// @ts-ignore
import formidable from "formidable-serverless";
import { supabase } from "../../lib/supabaseClient";
import { DEFAULT_AVATARS_BUCKET, emojis } from "../../lib/constants";
import * as fs from "fs";

type Query = {
  [p: string]: string | string[] | undefined;
  emoji?: string;
  fixed?: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await new Promise((resolve, reject) => {
    if (req.method === "POST") {
      const query = req.query as Query;

      const form = new formidable.IncomingForm({
        keepExtensions: true,
        maxFileSize: 5000000,
      });

      form.parse(req, async (err: any, fields: Fields, files: Files) => {
        if (err)
          return res
            .status(400)
            .json({ data: `Error while parsing form: ${err}` });

        const keys: string[] = [];

        for (const [key] of Object.entries(files)) {
          keys.push(key);
        }

        interface File {
          [index: string]: {
            size: number;
            path: string;
            filepath: string;
            name: string;
            originalFilename: string;
            type: string;
            mtime: string;
          };
        }

        const file = files as any as formidable.Files & File;

        for (const k of keys) {
          let result: string[] = [],
            decode: string[] = [];

          if (!query.fixed) {
            if (query.emoji?.toLowerCase() === "true" || !query.emoji) {
              let i;
              for (i = 0; i < 5; i++) {
                result.push(
                  Object.keys(emojis)[
                    (Object.keys(emojis).length * Math.random()) << 0
                  ]
                );
              }

              result.forEach((k) => decode.push(emojis[k]));
            } else {
              result.push("&" + Math.random().toString(16).substr(2, 8));
              result.forEach((k) => decode.push(k));
            }
          } else {
            result.push(
              "&" +
                `${
                  Array.isArray(files)
                    ? files[0][k].name
                      ? files[0][k].name.split(".")[0]
                      : files[0][k].originalFilename.split(".")[0]
                    : file[k].name
                    ? file[k].name.split(".")[0]
                    : file[k].originalFilename.split(".")[0]
                }`
            );
            result.forEach((k) => decode.push(k));
          }

          const filePath = `${[...decode]}.${
            Array.isArray(files)
              ? files[0][k].name
                ? files[0][k].name.split(".").pop()
                : files[0][k].originalFilename.split(".").pop()
              : file[k].name
              ? file[k].name.split(".").pop()
              : file[k].originalFilename.split(".").pop()
          }`;

          console.log(filePath);
          const redirect = `${result.join("")}.${
            Array.isArray(files)
              ? files[0][k].name
                ? files[0][k].name.split(".").pop()
                : files[0][k].originalFilename.split(".").pop()
              : file[k].name
              ? file[k].name.split(".").pop()
              : file[k].originalFilename.split(".").pop()
          }`;

          let { error: uploadError } = await supabase.storage
            .from(DEFAULT_AVATARS_BUCKET)
            .upload(
              filePath,
              Array.isArray(files)
                ? Uint8Array.from(
                    fs.readFileSync(files[0][k].path ?? files[0][k].filepath)
                  )
                : Uint8Array.from(
                    fs.readFileSync(file[k].path ?? file[k].filepath)
                  )
            );

          if (uploadError) return res.status(500).json({ data: uploadError });
          return res.status(200).json({
            success: true,
            data: `https://cdn.dont-ping.me/api/${redirect}`,
          });
        }
      });
    } else {
      // Method is not POST, return 405 method not allowed
      return res
        .status(405)
        .json({ success: false, data: "Method not allowed" });
    }
  });
}
