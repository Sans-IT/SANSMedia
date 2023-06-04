// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { getuser } = req.query;
    res.setHeader("Cache-Control", "no-store");
    if (req.method === "GET") {
      if (getuser?.length === 36) {
        const data = await prisma.user.findUnique({
          where: {
            id: String(getuser),
          },
          include: {
            post: {
              orderBy: {
                createAt: "desc",
              },
              include: {
                user: true,
              },
            },
          },
        });
        return res.status(200).json(data);
      } else {
        const data = await prisma.user.findUnique({
          where: {
            username: String(getuser),
          },
          include: {
            post: {
              orderBy: {
                createAt: "desc",
              },
              include: {
                user: true,
              },
            },
          },
        });
        return res.status(200).json(data);
      }
    }
  } catch (err) {
    return res.status(500).json({ message: "error getting user" });
  }
}
