import { ErrorType } from "@/shared/types/Errors";
import express from "express";

export const errorResponder = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  switch (err.formfixType) {
    case ErrorType.WrongData:
      return res.status(422).send({ message: "Wrong data." });
    case ErrorType.NoData:
      return res.status(400).send({ message: "Bad request. Not enough data." });
    case ErrorType.Unauthorized:
      return res.status(401).send({ message: "Authorization error." });
    case ErrorType.NotFound:
      return res.status(404).send({ message: "Not found." });
    case ErrorType.DoNotRespond:
      return;

    case ErrorType.Caught:
    default:
      return next(err); // forwarding to @/helpers/failSafeHandler
  }
};
