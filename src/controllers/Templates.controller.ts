import express from "express";

import { TemplatesService } from "@/services";

import { defineErrorFields } from "@/shared/helpers/errorHandlers";

import { ERROR_MSG } from "@/shared/const";

import { ErrorType, TemplateFileExt, TemplateFileType } from "@/shared/types";

class TemplatesClass {
  async getFile(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const fileExt = req.params.fileExt as TemplateFileExt;
    const isFileExtValid = fileExt === "xls" || fileExt === "xlsx";
    const type = req.params.type as TemplateFileType;
    const isTypeValid = type === "tracks";

    if (!isFileExtValid || !isTypeValid) {
      let err = new Error(ERROR_MSG.NoData);
      const from = "Templates.controller.getFile";
      err = defineErrorFields(err, ErrorType.NoData, from, req);
      return next(err);
    }

    const fileName = type + "Template." + fileExt;
    try {
      const buffer = await TemplatesService.getFile(fileName);
      res.setHeader("Content-Type", "application/octet-stream");
      res.end(buffer);
    } catch (err) {
      const from = "Templates.controller.getFile";
      err = defineErrorFields(err, ErrorType.Caught, from, req);
      return next(err);
    }
  }
}

export const TemplatesController = new TemplatesClass();
