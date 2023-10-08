import express from "express";

import { ReportsController } from "@/controllers/";

const router = express.Router();

router.route(`/:fileExt`).post(ReportsController.getReportFile);

export const ReportsRoutes = router;
