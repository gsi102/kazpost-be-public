import express from "express";

import { MoyskladService } from "@/services";

import { defineErrorFields } from "@/shared/helpers/errorHandlers";

import { Entity, ErrorType } from "@/shared/types";
import { ERROR_MSG } from "@/shared/const";

class MoyskladControllerClass {
  async getContext(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const contextKey = req.params.contextKey;
    if (!contextKey) {
      let err = new Error(ERROR_MSG.NoData);
      const from = "Moysklad.controller.getContext";
      err = defineErrorFields(err, ErrorType.NoData, from, req);
      return next(err);
    }

    try {
      const context: any = await MoyskladService.getContext(contextKey);

      return res
        .set({ "Content-Type": "application/json" })
        .status(200)
        .send({ context });
    } catch (err) {
      const from = "Moysklad.controller.getContext";
      err = defineErrorFields(err, ErrorType.Caught, from, req);
      return next(err);
    }
  }

  async getEntityData(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const accountId = req.body.accountId;
    const entity = req.params.entity as Entity;
    if (!accountId || !entity) {
      let err = new Error(ERROR_MSG.NoData);
      const from = "Moysklad.controller.getEntityData";
      err = defineErrorFields(err, ErrorType.NoData, from, req);
      return next(err);
    }
    const { dataType, entityId, filter, expand, limit, offset, order, search } =
      req.body;

    try {
      const accessToken = await MoyskladService.getAccessToken(accountId);

      const entityData = await MoyskladService.getEntityData({
        entity,
        accessToken,
        entityId,
        dataType,
        filter,
        expand,
        limit,
        offset,
        order,
        search,
      });

      return res
        .set({ "Content-Type": "application/json" })
        .status(200)
        .send({ entityData });
    } catch (err) {
      const from = "Moysklad.controller.getEntityData";
      err = defineErrorFields(err, ErrorType.Caught, from, req);
      return next(err);
    }
  }

  async changeEntityData(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { accountId, objectId, dataToUpdate } = req.body;
    const entity = req.params.entity as Entity;
    if (!accountId || !objectId || !entity) {
      let err = new Error(ERROR_MSG.NoData);
      const from = "Moysklad.controller.changeEntityData";
      err = defineErrorFields(err, ErrorType.NoData, from, req);
      return next(err);
    }

    try {
      const accessToken = await MoyskladService.getAccessToken(accountId);

      const entityData = await MoyskladService.changeEntityData({
        entity,
        objectId,
        accessToken,
        dataToUpdate,
      });

      return res
        .set({ "Content-Type": "application/json" })
        .status(200)
        .send({ entityData });
    } catch (err) {
      const from = "Moysklad.controller.changeEntityData";
      err = defineErrorFields(err, ErrorType.Caught, from, req);
      return next(err);
    }
  }
}

export const MoyskladController = new MoyskladControllerClass();
