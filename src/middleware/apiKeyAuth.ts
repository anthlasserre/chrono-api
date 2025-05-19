import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

// In a real application, you would store these in a database
// and probably hash them. This is just for demonstration.
dotenv.config();
const VALID_API_KEYS = process.env.VALID_API_KEYS?.split(",");

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header("X-API-Key");

  if (!apiKey) {
    return res.status(401).json({ error: "API key is required" });
  }

  if (!VALID_API_KEYS?.includes(apiKey)) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  next();
};
