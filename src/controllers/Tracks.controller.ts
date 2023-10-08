import express from "express";
import fs from "fs/promises";

import { TracksService } from "@/services";

import { defineErrorFields } from "@/shared/helpers/errorHandlers";

import { ERROR_MSG } from "@/shared/const";

import { ErrorType } from "@/shared/types";

class TracksClass {
  async uploadFile(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const file = req.file;
    const { accountId, attributeId } = req.body;

    if (!file || !accountId || !attributeId) {
      let err = new Error(ERROR_MSG.NoData);
      const from = "Tracks.controller.uploadFile";
      err = defineErrorFields(err, ErrorType.NoData, from, req);
      return next(err);
    }

    /**
     * fieldname: 'tracksFile',
     * originalname: 'kazpostTracks.xlsx',
     * encoding: '7bit',
     * mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
     * destination: '/var/www/kazpost-app/dist/tmp/uploads',
     * filename: 'tracksFile-1687338886544-8cb67664-e3ca-4e04-91b5-a1113a61d1dd',
     * path: '/var/www/kazpost-app/dist/tmp/uploads/tracksFile-1687338886544-8cb67664-e3ca-4e04-91b5-a1113a61d1dd',
     * size: 5975
     * */

    const { path } = file;

    try {
      // проверка доступности файла
      await fs.access(path, fs.constants.R_OK);

      const results = await TracksService.uploadFile(
        accountId,
        attributeId,
        path
      );

      return res.status(200).send(results);
    } catch (err) {
      const from = "Tracks.controller.uploadFile";
      err = defineErrorFields(err, ErrorType.Caught, from, req);
      return next(err);
    }
  }
}

export const TracksController = new TracksClass();
