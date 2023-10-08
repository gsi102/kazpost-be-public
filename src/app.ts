import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { routes } from "@/routes";
import {
  errorLogger,
  errorResponder,
  failSafeHandler,
} from "@/shared/helpers/errorHandlers";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use(errorLogger);
app.use(errorResponder);
app.use(failSafeHandler);

//---------------------------
const env = dotenv.config();
const PORT = env.parsed?.PORT || 3001;
const NODE_ENV = env.parsed?.NODE_ENV || "development";
app.listen(PORT, () => {
  console.log(`Port: ${PORT}`);
  console.log(`ENV_MODE=${process.env.NODE_ENV}`);
});
