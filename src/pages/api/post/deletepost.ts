// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { postid } = req.query;
    if (req.method === "DELETE") {
      const data = await prisma.post.delete({
        where: {
          id: String(postid),
        },
      });
      return res.status(200).json(data);
    }
  } catch (err) {
    return res.status(500).json({ error: "error delete post" });
  }
}
