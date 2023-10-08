import express from "express";

import { VENDOR_ENDPOINT } from "@/config/api";

import { VendorRoutes } from "./Vendor.routes";
import { MoyskladRoutes } from "./Moysklad.routes";
import { ReportsRoutes } from "./Reports.routes";
import { TracksRoutes } from "./Tracks.routes";
import { TemplatesRoutes } from "./Templates.routes";
import { DbRoutes } from "./Db.routes";

const router = express.Router();

router.use(VENDOR_ENDPOINT, VendorRoutes);
router.use("/moysklad", MoyskladRoutes);
router.use("/reports/", ReportsRoutes);
router.use("/tracks/", TracksRoutes);
router.use("/templates/", TemplatesRoutes);
router.use("/db/", DbRoutes);

export const routes = router;
