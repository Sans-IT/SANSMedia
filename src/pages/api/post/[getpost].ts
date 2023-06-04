// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // findPost
    const { getpost } = req.query;
    if (req.method === "GET") {
      const data = await prisma.post.findMany({
        where: {
          user: {
            username: String(getpost),
          },
        },
        include: {
          user: {
            select: {
              avatar: true,
              username: true,
              biodata: true,
              id: true,
            },
          },
        },
        orderBy: {
          createAt: "desc",
        },
      });
      return res.status(200).json(data);
    }
  } catch (err) {
    return res.status(500).json({ message: "error getting user" });
  }
}
