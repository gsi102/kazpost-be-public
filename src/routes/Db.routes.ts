import express from "express";

import { DbController } from "@/controllers/";

const router = express.Router();

router
  .route("/:accountId")
  .put(DbController.createRow)
  .post(DbController.getRowData)
  .patch(DbController.updateRow);

export const DbRoutes = router;
