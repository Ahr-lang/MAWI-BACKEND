import { Router } from "express";

export const abtRouter = Router();

abtRouter.get("/examples", (_req, res) => {
  res.json({ data: [], note: "ABT sample endpoint" });
});
