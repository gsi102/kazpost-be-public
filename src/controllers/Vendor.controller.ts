import express from "express";

import { DBService, VendorService, MoyskladService } from "@/services";

import { encrypt } from "@/shared/helpers/encryption/AES";
import { signJwt } from "@/shared/helpers/signJwt";
import { defineErrorFields } from "@/shared/helpers/errorHandlers/";

import { ERROR_MSG } from "@/shared/const";
import { AccountsColumn, AppStatus, DbTable, ErrorType } from "@/shared/types";
import { Op } from "sequelize";

class VendorControllerClass {
  async getAppStatus(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const accountId = req.params.accountId;
    if (!accountId) {
      let err = new Error(ERROR_MSG.NoData);
      const from = "Vendor.controller.getAppStatus";
      err = defineErrorFields(err, ErrorType.NoData, from, req);
      return next(err);
    }

    try {
      const table = DbTable.Accounts;
      const getColumns = [AccountsColumn.Status];
      const where = {
        [AccountsColumn.Id]: { [Op.eq]: accountId },
      };

      const status = await DBService.getRow({
        table,
        accountId,
        getColumns,
        where,
      }).then((accountData) => {
        if (accountData) return accountData[AccountsColumn.Status];
        else return null;
      });

      const isStatusStrict =
        status === "Activated" ||
        status === "SettingsRequired" ||
        status === "Activating";
      if (!isStatusStrict) return res.status(404);

      return res
        .set({ "Content-Type": "application/json" })
        .status(200)
        .send({ status });
    } catch (err: any) {
      const from = "Vendor.controller.getAppStatus";
      err = defineErrorFields(err, ErrorType.Caught, from, req);
      return next(err);
    }
  }

  async installApp(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const accountId = req.params.accountId;
    const accessField = req.body.access;
    if (!accountId || !accessField) {
      let err = new Error(ERROR_MSG.NoData);
      const from = "Vendor.controller.installApp";
      err = defineErrorFields(err, ErrorType.NoData, from, req);
      return next(err);
    }
    const accessToken = accessField[0].access_token;
    const tokenEncrypted = encrypt(accessToken);

    if (process.env.NODE_ENV == "development") {
      console.log({
        from: "Vendor.controller.installApp",
        accessToken,
      });
    }

    try {
      await VendorService.installApp(
        accountId,
        AppStatus.Activated,
        tokenEncrypted
      );

      // обновить статус приложения на стороне МоегоСклада,
      await MoyskladService.updateAppStatus(
        accountId,
        AppStatus.Activated,
        signJwt()
      );

      return res
        .set({ "Content-Type": "application/json" })
        .status(200)
        .send({ status: "Activated" });
    } catch (err) {
      const from = "Vendor.controller.installApp";
      err = defineErrorFields(err, ErrorType.Caught, from, req);
      return next(err);
    }
  }

  async deleteApp(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const accountId = req.params.accountId;
    const status = req.body.cause;
    if (!accountId || !status) {
      let err = new Error(ERROR_MSG.NoData);
      const from = "Vendor.controller.deleteApp";
      err = defineErrorFields(err, ErrorType.NoData, from, req);
      return next(err);
    }

    try {
      await VendorService.deleteApp(accountId, status);

      return res.status(200).end();
    } catch (err) {
      const from = "Vendor.controller.deleteApp";
      err = defineErrorFields(err, ErrorType.NotFound, from, req);
      return next(err);
    }
  }
}
export const VendorController = new VendorControllerClass();
