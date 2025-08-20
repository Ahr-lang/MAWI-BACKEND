import { Router } from "express";

export const robotRouter = Router();

robotRouter.get("/examples", (_req, res) => {
  res.json({ data: [], note: "Robot sample endpoint" });
});
