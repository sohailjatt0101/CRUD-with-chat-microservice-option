import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

// Custom error class (optional but useful for controlled errors)
export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

// This MUST have 4 parameters (err, req, res, next) — that's how Express
// knows this is an error-handling middleware, not a regular one.
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};

