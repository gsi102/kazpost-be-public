import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { VendorController } from "@/controllers/Vendor.controller";

import { APP_ID, SECRET_VENDOR } from "@/config/secret";
import { defineErrorFields } from "@/shared/helpers/errorHandlers";
import { ErrorType } from "@/shared/types";

const router = express.Router();

// аутентификация
router.use(async (req: any, res, next) => {
  if (!req.headers.authorization)
    return res.status(401).send({ message: "Authorization error" });

  // Remove "Bearer " str
  const authorizationJWT = req.headers.authorization?.slice(7);

  try {
    const token: string | JwtPayload = jwt.verify(
      authorizationJWT,
      SECRET_VENDOR
    );
    if (typeof token !== "string") {
      const expired = token.exp;
      const now = Math.floor(new Date().getTime() / 1000);
      if (expired && now > expired) {
        throw new Error("JWT token is expired");
      }
    }
    next();
  } catch (err) {
    const from = "Vendor.routes.middleware";
    err = defineErrorFields(err, ErrorType.Unauthorized, from, req);
    return next(err);
  }
});

// ендпоинты строгие, их использует МойСклад
router
  .route(`/${APP_ID}/:accountId`)
  .get(VendorController.getAppStatus)
  .put(VendorController.installApp)
  .delete(VendorController.deleteApp);

export const VendorRoutes = router;
