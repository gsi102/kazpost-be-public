import fs from "fs/promises";
import path from "path";
import util from "util";
import * as ExcelJS from "exceljs";
import libre from "libreoffice-convert";

import { ReportData } from "@/shared/types";

const libreConvertAsync = util.promisify(libre.convert);

class ReportsServiceClass {
  async getReportFile(
    fileName: string,
    reportData: ReportData
  ): Promise<ExcelJS.Buffer> {
    const filePath = path.join(
      __dirname,
      "../public",
      `/templates`,
      `/${fileName}`
    );

    // Проверка доступности файла
    await fs.access(filePath, fs.constants.R_OK).catch((err) => {
      throw err;
    });

    // Создание пустой таблицы
    const wbTemplate = new ExcelJS.Workbook();
    // Чтение и запись из шаблона
    const wb = await wbTemplate.xlsx.readFile(filePath);
    // Запись в константу первого Листа и установки для таблицы
    const ws = wb.getWorksheet(1);
    ws.pageSetup = {
      paperSize: 9,
      orientation: "landscape",
      fitToPage: true,
    };

    /* Вставить значения в шаблон */
    const personFrom = ws.getCell("C4");
    personFrom.value = reportData.from.personFrom;
    const phoneFrom = ws.getCell("E6");
    phoneFrom.value = reportData.from.phoneFrom;
    const addressFrom = ws.getCell("C9");
    addressFrom.value = reportData.from.addressFrom;
    const zipFrom = ws.getCell("E11");
    zipFrom.value = reportData.from.zipFrom;
    const price = ws.getCell("E16");
    price.value = reportData.price;
    const payAmount = ws.getCell("E18");
    payAmount.value = reportData.payAmount;

    const personTo = ws.getCell("H15");
    personTo.value = reportData.to.personTo;
    const phoneTo = ws.getCell("J17");
    phoneTo.value = reportData.to.phoneTo;
    const addressTo = ws.getCell("H20");
    addressTo.value = reportData.to.addressTo;
    const zipTo = ws.getCell("J22");
    zipTo.value = reportData.to.zipTo;

    return wb.xlsx.writeBuffer();
  }

  xlsxToPdf(buffer: Buffer) {
    return libreConvertAsync(buffer, ".pdf", undefined);
  }
}

export const ReportsService = new ReportsServiceClass();
