import jwt from "jsonwebtoken";

interface RequestSession {
  id: string;
  role: string;
}

export const decodeToken = (token: string) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET || "");

  return decoded as RequestSession;
};
