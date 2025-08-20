import type { NextFunction, Request, Response } from "express";

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const status = 500;
  const message = err instanceof Error ? err.message : "Internal Server Error";
  res.status(status).json({ error: message });
}
