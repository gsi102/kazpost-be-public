import fs from "fs/promises";
import * as sheetjs from "xlsx";

import { MoyskladService } from "./Moysklad.service";

import { Nullable } from "@/shared/types/helpers";
import {
  CreatedAttributeData,
  createAttributeData,
} from "@/shared/helpers/createAttributeData";
import { PendingPromise } from "@/shared/helpers/PendingPromise";
import { requestAsChunks } from "@/shared/helpers/requestAsChunks";
import { processingChunks } from "@/shared/helpers/processingChunks";

import { KAZPOST_TRACK_URL } from "@/shared/const";

import { Entity, Customerorder } from "@/shared/types";

type ParsingOptions = sheetjs.ParsingOptions;
// type WritingOptions = sheetjs.WritingOptions;
// type CellObject = sheetjs.CellObject;
// type WSKeys = sheetjs.WSKeys;

type ElementToUpdate = {
  id: Nullable<string>;
  name: string;
  attributes: CreatedAttributeData[];
};

class TracksClass {
  async uploadFile(accountId: string, attributeId: string, filePath: string) {
    const readOpts: ParsingOptions = {
      type: "file",
      cellHTML: false,
      cellFormula: false,
    };
    const wb = sheetjs.readFile(filePath, readOpts);
    const firstSheetName = wb.SheetNames[0];
    const firstSheet = wb.Sheets[firstSheetName];

    const toJsonOpts = {
      header: 1,
      blankrows: false,
      raw: true,
      skipHidden: true,
      rawNumbers: true,
    };
    const jsonSheet: Array<Array<string>> = sheetjs.utils.sheet_to_json(
      firstSheet,
      toJsonOpts
    );

    // Asynchronously delete the file
    await fs.unlink(filePath).catch((err) => {
      throw err;
    });

    const objectNames = new Array(0);

    let dataToUpdate = jsonSheet.reduce(
      (result: Array<ElementToUpdate>, pair, index) => {
        // Пропуск первой строки
        if (!index) return result;
        const [objectName, trackId] = pair;
        const name = objectName ? objectName.toString() : "";
        const track = trackId ? trackId.toString().toUpperCase() : "";
        const trackFullUrl = track ? KAZPOST_TRACK_URL + "/" + track : null;
        const attributeData = createAttributeData(
          attributeId,
          Entity.Customerorder,
          trackFullUrl
        );

        const elementToUpdate = {
          id: null,
          name,
          attributes: [attributeData],
        };

        objectNames.push(objectName);
        result.push(elementToUpdate);
        return result;
      },
      []
    );

    try {
      const accessToken = await MoyskladService.getAccessToken(accountId);

      // 1. Запрос в МС на получение ид с фильтрацией по номерам документов
      const args = {
        accessToken,
        entity: Entity.Customerorder,
      };
      const requests: PendingPromise[] = requestAsChunks({
        arr: objectNames,
        filterBy: "name",
        cbPromise: MoyskladService.getEntityData,
        args,
        itemsLimit: 500,
      });
      const objectsMS: Customerorder[] = await processingChunks(requests).then(
        (res) => res.rows
      );

      // 2. Добавление ид документов в объект для послед. запроса на обновление
      const total = dataToUpdate.length;
      let errors = 0;
      dataToUpdate = dataToUpdate.filter((el) => {
        const found = objectsMS.find((order) => order.name === el.name);
        if (!found) {
          errors++;
          return false;
        }
        el.id = found.id;
        return true;
      });
      const success = dataToUpdate.length;

      // 3. Массовый апдейт одним запросом, если заказы найдены
      if (success) {
        await MoyskladService.bulkChangeEntityData({
          entity: Entity.Customerorder,
          accessToken,
          dataToUpdate,
        });
      }

      return { total, errors, success };
    } catch (err) {
      throw err;
    }
  }
}

export const TracksService = new TracksClass();
