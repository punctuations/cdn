import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    return new Promise(async (resolve) => {
        const uuid = req.query.uuid as string;

        const response = await fetch(
            process.env.NODE_ENV === "development"
                ? "http://0.0.0.0:3000/api/read"
                : "https://timerr.vercel.app/api/read",
            {
                method: "POST",
                body: JSON.stringify({
                    uuid
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ).then(r => r.json()).then((body) => body.prisma.data);

        res.setHeader(
            "Content-Type",
            `application/json charset=utf-8`
        )

        res.status(200);
        res.send(
            {data: response}
        );
        return resolve("Created Image!");
    });
}