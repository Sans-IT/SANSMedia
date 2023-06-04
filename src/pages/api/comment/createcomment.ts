// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { Comment } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query: Comment = req.body;
  try {
    if (req.method === "POST") {
      const data = await prisma.comment.create({
        data: {
          body: query.body,
          user: {
            connect: {
              id: query.userId,
            },
          },
          post: {
            connect: {
              id: query.postId,
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
