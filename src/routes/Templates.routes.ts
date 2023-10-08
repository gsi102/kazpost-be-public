import express from "express";

import { TemplatesController } from "@/controllers/";

const router = express.Router();

router.route(`/:type/:fileExt`).get(TemplatesController.getFile);

export const TemplatesRoutes = router;
