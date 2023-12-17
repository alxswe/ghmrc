import { authOptions } from "@/server/auth";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, authOptions(req, res));
};

export default handler;
