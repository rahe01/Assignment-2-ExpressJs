import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, token missing",
        });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(
        token as string,
        config.jwtSecret as string
      ) as JwtPayload;

      req.user = decoded;

      if (roles.length && (!decoded.role || !roles.includes(decoded.role))) {
        return res.status(403).json({
          success: false,
          message: "Access denied, insufficient permission",
        });
      }

      next();
    } catch (err: any) {
      return res.status(401).json({
        success: false,
        message: "Token invalid or expired",
      });
    }
  };
};

export default auth;
