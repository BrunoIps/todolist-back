import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "../utils/customError";

const JWT_SECRET = process.env.JWT_SECRET || "seu-segredo-jwt";

interface CustomRequest extends Request {
  user?: any;
}

export const authenticateJWT = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new CustomError(403, "Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    throw new CustomError(401, "Unauthorized");
  }
};
