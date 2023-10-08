import express from "express";
import axios from "axios";

// import { SLACK_WEBHOOK } from "@/shared/const/config/config";
import { ErrorType } from "@/shared/types";
import { SLACK_URL, SLACK_WEBHOOK } from "@/config/secret";

type ErrType = any & {
  formfixType: ErrorType;
  formfixFrom: string;
  formfixWhen: string;
  formfixRequestData: {
    params: any;
    body: any;
  };
};

export const errorLogger = (
  err: ErrType,
  req: express.Request | null,
  res: express.Response | null,
  next: express.NextFunction | null
) => {
  const errToLog = {
    message: err.message,
    errors: err.formfixMSErr,
    type: err.formfixType,
    url: err.formfixURL,
    ip: err.formfixIP,
    from: err.formfixFrom,
    when: err.formfixWhen,
    data: err.formfixRequestData,
  };

  if (process.env.NODE_ENV === "development") {
    console.log(errToLog);
  }

  if (process.env.NODE_ENV === "production") {
    const url = SLACK_URL + "/" + SLACK_WEBHOOK;
    const text = `
    ================================\n
    MESSAGE: ${errToLog.message},\n
    ERR: ${errToLog.errors},\n
    TYPE: ${errToLog.type},\n
    URL: ${errToLog.url},\n
    IP: ${errToLog.ip},\n
    FROM: ${errToLog.from},\n
    WHEN: ${errToLog.when},\n
    DATA: ${JSON.stringify(errToLog.data)},\n`;
    const body = { text };
    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    // намеренно без await
    axios.post(url, body, headers).catch((err) => {
      console.log({
        from: "helpers/errorLogger, error while sending WH to Slack.",
        errToLog,
        err,
      });
    });
  }

  return next && next(err); // forwarding to @/helpers/errorResponder
};
