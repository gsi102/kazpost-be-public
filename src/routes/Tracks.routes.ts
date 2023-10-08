import express from "express";
import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

import { TracksController } from "@/controllers/";
import { ErrorType, UploadedFileExt } from "@/shared/types";
import { defineErrorFields } from "@/shared/helpers/errorHandlers";
import { ERROR_MSG } from "@/shared/const";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const filePath = path.join(__dirname, "../tmp/uploads");
    cb(null, filePath);
    return;
  },
  filename: function (req, file, cb) {
    const re = /[^.]+/gm;
    const fileName = file.originalname;
    const reExec = fileName.match(re);
    if (!reExec) {
      let err = new Error(ERROR_MSG.WrongFormat);
      const from = "multer.diskStorage.filename";
      err = defineErrorFields(err, ErrorType.WrongData, from, req);
      cb(err, fileName);
      return;
    }

    const fileNameNoExt = reExec[0];
    const fileExt = reExec[reExec.length - 1];

    if (!fileNameNoExt || !(fileExt in UploadedFileExt)) {
      let err = new Error(ERROR_MSG.WrongFormat);
      const from = "multer.diskStorage.filename";
      err = defineErrorFields(err, ErrorType.WrongData, from, req);
      cb(err, fileName);
      return;
    }

    const uniqueSuffix =
      fileNameNoExt + "-" + Date.now() + "-" + uuidv4() + "." + fileExt;
    if (uniqueSuffix.length > 500) {
      let err = new Error(ERROR_MSG.TooLongURI);
      const from = "multer.diskStorage.filename";
      err = defineErrorFields(err, ErrorType.WrongData, from, req);
      cb(err, fileName);
      return;
    }

    cb(null, uniqueSuffix);
    return;
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 5242880,
    fileSize: 5242880,
  },
  // fileFilter: function (req, file, cb) {
  //  // The function should call `cb` with a boolean
  // // to indicate if the file should be accepted
  // // To reject this file pass `false`, like so:
  // cb(null, false)
  // // To accept the file pass `true`, like so:
  // cb(null, true)
  // // You can always pass an error if something goes wrong:
  // cb(new Error('I don\'t have a clue!'))
  // },
});

const router = express.Router();
router
  .route(`/upload`)
  .post(upload.single("tracksFile"), TracksController.uploadFile);

export const TracksRoutes = router;
