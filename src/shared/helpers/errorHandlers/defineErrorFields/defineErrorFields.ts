import { hasOwnProp } from "@/shared/helpers/hasOwnProp";
import { isObjectProperty } from "@/shared/helpers/isObjectProperty";
import { ErrorType } from "@/shared/types";
import express from "express";

export const defineErrorFields = (
  err: any,
  type: ErrorType,
  from: string,
  req: express.Request | null
) => {
  // custom fields
  const isErrors =
    isObjectProperty(err, "response") && hasOwnProp(err.response, "data");

  let ip: any = "";
  if (req) {
    ip = req.headers["x-real-ip"];
    if (!ip) ip = req.socket.remoteAddress;
    if (!ip) ip = "";
  }
  err.formfixIP = ip;
  err.formfixMSErr = isErrors ? JSON.stringify(err.response.data) : "";
  err.formfixType = type;
  err.formfixFrom = from;
  err.formfixWhen = new Date().toLocaleString("en-US", {
    timeZone: "Europe/Moscow",
  });
  err.formfixURL =
    req && req.hasOwnProperty("originalUrl") ? req.originalUrl : null;

  const params =
    req && req.hasOwnProperty("params")
      ? JSON.parse(JSON.stringify(req.params))
      : null;

  const body =
    req && req.hasOwnProperty("body")
      ? JSON.parse(JSON.stringify(req.body))
      : null;

  err.formfixRequestData = {
    params,
    body,
  };

  return err;
};
