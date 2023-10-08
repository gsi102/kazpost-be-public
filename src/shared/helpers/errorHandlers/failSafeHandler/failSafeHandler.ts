import express from "express";

export const failSafeHandler = (
  error: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => res.status(500).send({ message: "Something went wrong on the server." });
