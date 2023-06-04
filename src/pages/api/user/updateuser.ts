// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { User } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const query: User = req.body;
    if (req.method === "PATCH") {
      const data = await prisma.user.update({
        where: {
          id: query.id,
        },
        data: {
          avatar: query.avatar,
          biodata: query.biodata,
          username: query.username,
        },
      });
      return res.status(200).json(data);
    }
  } catch (err) {
    return res.status(500).json({ message: "error update datauser" });
  }
}
