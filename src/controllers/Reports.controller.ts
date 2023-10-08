import express from "express";

import { DBService, ReportsService } from "@/services";

import { defineErrorFields } from "@/shared/helpers/errorHandlers";

import { ERROR_MSG } from "@/shared/const";

import {
  ErrorType,
  ReportFileExt,
  ReportData,
  DbTable,
  AccountsColumn,
} from "@/shared/types";
import { Op } from "sequelize";

class ReportsControllerClass {
  async getReportFile(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const fileExt = req.params.fileExt as ReportFileExt;
    const isFileExtValid = fileExt === "xlsx";
    const reportData = req.body.reportData as ReportData;
    const accountId = req.body.accountId;

    if (!isFileExtValid || !accountId) {
      let err = new Error(ERROR_MSG.NoData);
      const from = "Reports.controller.getReportFile";
      err = defineErrorFields(err, ErrorType.NoData, from, req);
      return next(err);
    }

    const fileName = "template." + fileExt;

    try {
      if (!reportData.from) {
        const getColumns = [
          AccountsColumn.PersonFrom,
          AccountsColumn.PhoneFrom,
          AccountsColumn.ZipFrom,
          AccountsColumn.AddressFrom,
        ];

        const where = {
          [AccountsColumn.Id]: {
            [Op.eq]: accountId,
          },
        };

        reportData.from = await DBService.getRow({
          accountId,
          table: DbTable.Accounts,
          getColumns,
          where,
        }).then((res) => {
          return { ...res };
        });
      }

      const buffer = await ReportsService.getReportFile(fileName, reportData);
      const pdfBuffer = await ReportsService.xlsxToPdf(buffer as Buffer);
      res.setHeader("Content-Type", "application/octet-stream");
      res.end(pdfBuffer);
    } catch (err) {
      const from = "Reports.controller.getReportFile";
      err = defineErrorFields(err, ErrorType.Caught, from, req);
      return next(err);
    }
  }
}

export const ReportsController = new ReportsControllerClass();
