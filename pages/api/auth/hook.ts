import { NextApiHandler } from "next";
import prisma from "../../../lib/prisma";

const handler: NextApiHandler = async (req, res) => {
  const { email, secret } = req.body;

  if (req.method !== "POST")
    return res.status(404).json({ message: "Route is not found" });

  if (secret !== process.env.AUTH0_HOOK_SECRET)
    return res.status(401).json({ message: "Unauthorized access" });

  if (!email)
    return res.status(400).json({ message: "Email must be provided" });

  await prisma.user.create({ data: { email } });

  return res.status(200).json({
    message: `User with email ${email} has been created successfully`,
  });
};

export default handler;
