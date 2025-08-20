import { Router } from "express";

export const commonRouter = Router();

commonRouter.get("/ping", (_req, res) => {
  res.status(200).json({ pong: true, ts: new Date().toISOString() });
});
