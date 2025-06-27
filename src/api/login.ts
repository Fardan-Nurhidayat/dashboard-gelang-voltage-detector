// File: api/login.ts
import { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, password } = req.body;

  try {
    await connectDB();

    const user = await User.findOne({ name, password }).select(
      "id name is_admin -_id"
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err });
  }
}
