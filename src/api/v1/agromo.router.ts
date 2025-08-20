import { Router } from "express";

export const agromoRouter = Router();

agromoRouter.get("/examples", (_req, res) => {
  res.json({ data: [], note: "Agromo sample endpoint" });
});
