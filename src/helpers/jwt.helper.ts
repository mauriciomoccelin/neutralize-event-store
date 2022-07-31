import jwt from "jsonwebtoken";
import { Request } from "express";

interface RequestSession {
  id: string;
  role: string;
}

export const decodeToken = (token: string) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET || "");

  return decoded as RequestSession;
};

export const decodeTokenFromRequest = (req: Request) => {
  const bearer = req.get("authorization") || "";
  const token = bearer.replace("Bearer ", "");

  return decodeToken(token);
};
