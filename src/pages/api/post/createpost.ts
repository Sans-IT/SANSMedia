// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { Post } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query: Post = req.body;
  try {
    if (req.method === "POST") {
      const data = await prisma.post.create({
        data: {
          title: query.title,
          body: query.body,
          published: query.published,
          source: query.source,
          type: query.type,
          sensitive: query.sensitive,
          user: {
            connect: {
              id: query.userId,
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
