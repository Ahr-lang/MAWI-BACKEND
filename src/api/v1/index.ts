import { Router } from "express";
import { commonRouter } from "./common.router.js";
import { abtRouter } from "./abt.router.js";
import { agromoRouter } from "./agromo.router.js";
import { robotRouter } from "./robot.router.js";

export const routerV1 = Router();
routerV1.use("/common", commonRouter);
routerV1.use("/abt", abtRouter);
routerV1.use("/agromo", agromoRouter);
routerV1.use("/robot", robotRouter);
