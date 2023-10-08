import express from "express";

import { DBService, Where } from "@/services/";

import { defineErrorFields } from "@/shared/helpers/errorHandlers";

import { ErrorMsgs, ErrorType } from "@/shared/types/Errors";

import { convertFilterForSequilize } from "@/shared/helpers/covertFilterForSequilize";

class DbControllerClass {
  async getRowData(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { accountId } = req.params;
    const { table, getColumns, where } = req.body;
    if (!accountId || !table || !getColumns) {
      let err = new Error(ErrorMsgs.NoData);
      const from = "db.controller.getRowData";
      err = defineErrorFields(err, ErrorType.NoData, from, req);
      return next(err);
    }
    const whereWithSymbolsOps = convertFilterForSequilize(where);

    try {
      const result = await DBService.getRow({
        accountId,
        table,
        getColumns,
        where: whereWithSymbolsOps,
      });

      return res
        .set({ "Content-Type": "application/json" })
        .status(200)
        .send(result);
    } catch (err: any) {
      const from = "Db.controller.getRowData";
      err = defineErrorFields(err, ErrorType.Caught, from, req);
      return next(err);
    }
  }

  async createRow(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { accountId } = req.params;
    const { table, dbData } = req.body;
    if (!accountId || !table || !dbData) {
      let err = new Error(ErrorMsgs.NoData);
      const from = "Db.controller.createRow";
      err = defineErrorFields(err, ErrorType.NoData, from, req);
      return next(err);
    }
    const objectId = req.body.objectId || accountId;

    try {
      await DBService.createRow({
        table,
        accountId,
        objectId,
        dbData,
      });
      return res.status(200).end();
    } catch (err) {
      const from = "Db.controller.createRow";
      err = defineErrorFields(err, ErrorType.Caught, from, req);
      return next(err);
    }
  }

  async updateRow(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { accountId } = req.params;
    const { table, dbData } = req.body;
    const where: Where = req.body.where;

    if (!accountId || !table || !dbData || !where) {
      let err = new Error(ErrorMsgs.NoData);
      const from = "Db.controller.updateRow";
      err = defineErrorFields(err, ErrorType.NoData, from, req);
      return next(err);
    }

    const whereWithSymbolsOps = convertFilterForSequilize(where);

    try {
      await DBService.updateRow({
        table,
        accountId,
        dbData,
        where: whereWithSymbolsOps,
      });
      return res.status(200).end();
    } catch (err) {
      const from = "Db.controller.updateRow";
      err = defineErrorFields(err, ErrorType.Caught, from, req);
      return next(err);
    }
  }
}

export const DbController = new DbControllerClass();
