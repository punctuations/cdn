import {NextApiRequest, NextApiResponse} from 'next';

import prisma from '../../../lib/db'

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '25mb'
        }
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        await prisma.image
            .create({
                data: {
                    data: req.body.data,
                    uuid: req.body.uuid,
                },
            })
            .catch((err) => console.log(err));

        return res.status(200).json({
            success: true,
            message: `Image uploaded to: /${req.body.uuid}`,
            uuid: req.body.uuid,
        });
    } else {
        // Method is not POST, return 405 method not allowed
        return res.status(405).json({success: false, data: "Method not allowed"});
    }
}