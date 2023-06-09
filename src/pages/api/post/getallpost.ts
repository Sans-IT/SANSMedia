// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const data = await prisma.post.findMany({
        orderBy: {
          createAt: "desc",
        },
        include: {
          user: {
            select: {
              avatar: true,
              username: true,
              id: true,
            },
          },
        },
      });
      return res.status(200).json(data);
    }
  } catch (err) {
    return res.status(500).json({ message: "error getting post" });
  }
}
