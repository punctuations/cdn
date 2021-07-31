import prisma from "../../../lib/db";
import {NextApiRequest, NextApiResponse} from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST") {
        const image = await prisma.image.findUnique({
            where: {
                uuid: req.body.uuid,
            },
        }).catch((err) => console.log(err));

        return res.status(200).json({success: true, prisma: image});
    } else {
        // Method is not POST, return 405 method not allowed
        return res.status(405).json({success: false, data: "Method not allowed"});
    }
};