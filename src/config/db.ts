import { CREDENTIALS_DB } from "@/config/secret";

import { Sequelize } from "sequelize";

const { Host, Name, Login, Password } = CREDENTIALS_DB;

export const db = new Sequelize(Name, Login, Password, {
  host: Host,
  dialect: "mysql",
  logging: false,
});
