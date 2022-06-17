import express from "express";
import { decodeToken } from "../helpers/jwt.helper";
import { hasPermissionForRole } from "../helpers/permission.helper";

export const authorize =
  (permission: string) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // check if the user is logged in

    const authorization = req.headers.authorization;
    if (!authorization)
      return res.status(401).send({ error: "No token provided" });

    const parts = authorization.split(" ");
    if (parts.length !== 2)
      return res.status(401).send({ error: "Token with invalid format" });

    const token = parts[1];
    const session = decodeToken(token);
    if (!session) return res.status(401).send({ error: "Invalid token" });

    // Check if user has permission for this route
    // If permission is not supply, authentication is sufficient
    if (!permission) next();

    if (!hasPermissionForRole(session.role, permission))
      return res.status(403).send({ error: "Forbidden" });

    return next();
  };
