import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { supabase } from "../../lib/supabaseClient";
import { DEFAULT_AVATARS_BUCKET, emojis } from "../../lib/constants";
import * as fs from "fs";

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
      const form = new formidable.IncomingForm({
        keepExtensions: true,
        maxFileSize: 10000000,
      });

      form.parse(req, async (err, fields, files) => {
        if (err) return reject(err);

        const keys: string[] = [];

        for (const [key] of Object.entries(files)) {
          keys.push(key);
        }

        interface File {
          [index: string]: {
            size: number;
            path: string;
            name: string;
            type: string;
            mtime: string;
          };
        }

        const file = files as any as formidable.Files & File;

        for (const k of keys) {
          let i,
            result = [],
            decode: string[] = [];
          for (i = 0; i < 5; i++) {
            result.push(
              Object.keys(emojis)[
                (Object.keys(emojis).length * Math.random()) << 0
              ]
            );
          }

          result.forEach((k) => decode.push(emojis[k]));

          const filePath = `${[...decode]}.${
            Array.isArray(files)
              ? files[0][k].name.split(".").pop()
              : file[k].name.split(".").pop()
          }`;
          const redirect = `${result.join("")}.${
            Array.isArray(files)
              ? files[0][k].name.split(".").pop()
              : file[k].name.split(".").pop()
          }`;

          let { error: uploadError } = await supabase.storage
            .from(DEFAULT_AVATARS_BUCKET)
            .upload(
              filePath,
              Array.isArray(files)
                ? Uint8Array.from(fs.readFileSync(files[0][k].path))
                : Uint8Array.from(fs.readFileSync(file[k].path))
            );
          resolve("Uploaded!");
          return res.status(200).json({
            success: true,
            data: `https://cdn.dont-ping.me/api/${redirect}`,
          });
        }
      });
    } else {
      reject("Method not allowed");
      // Method is not POST, return 405 method not allowed
      return res
        .status(405)
        .json({ success: false, data: "Method not allowed" });
    }
  });
}
