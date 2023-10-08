import express from "express";

import { MoyskladController } from "@/controllers/Moysklad.controller";

const router = express.Router();

router.route("/context/:contextKey").get(MoyskladController.getContext);

router
  .route("/entity/:entity")
  .post(MoyskladController.getEntityData)
  .put(MoyskladController.changeEntityData);

export const MoyskladRoutes = router;
