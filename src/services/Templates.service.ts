import fs from "fs/promises";
import path from "path";
import * as sheetjs from "xlsx";

import { isObjectProperty } from "@/shared/helpers/isObjectProperty";

type ParsingOptions = sheetjs.ParsingOptions;
type WritingOptions = sheetjs.WritingOptions;
type CellObject = sheetjs.CellObject;
type WSKeys = sheetjs.WSKeys;

class TemplatesClass {
  async getFile(fileName: string): Promise<sheetjs.WorkBook> {
    const filePath = path.join(
      __dirname,
      "../public",
      `/templates`,
      `/${fileName}`
    );

    // проверка доступности файла
    await fs.access(filePath, fs.constants.R_OK).catch((err) => {
      throw err;
    });

    const readOptions: ParsingOptions = {
      cellStyles: true,
    };

    const wb = sheetjs.readFile(filePath, readOptions);
    const firstSheetName = wb.SheetNames[0];
    const firstSheet = wb.Sheets[firstSheetName];

    /** Подгонка ширины столбца под длину столбцов в первой строке */
    if (isObjectProperty(firstSheet, "!cols")) {
      const columns = ["A", "B"];
      columns.forEach((col, i) => {
        const headerCell: CellObject | WSKeys | any = firstSheet[col + 1];
        if (!headerCell) return;
        const valueLength = headerCell.v?.length;
        if (!valueLength || valueLength < 1) return;
        // Проверка выше
        //@ts-ignore
        let colItem = firstSheet["!cols"][i];
        if (!colItem) return;
        colItem = { ...colItem, width: valueLength };
      });
    }

    const writeOptions: WritingOptions = {
      type: "buffer",
      bookType: "xls",
    };
    return sheetjs.write(wb, writeOptions);
  }
}

export const TemplatesService = new TemplatesClass();
