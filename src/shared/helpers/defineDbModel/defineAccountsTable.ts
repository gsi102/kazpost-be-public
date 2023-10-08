import { db } from "@/config/db";
import { AccountsColumn } from "@/shared/types";

import { DataTypes, ModelStatic, Model } from "sequelize";

export const defineAccountsTable = (tableName: string): ModelStatic<Model> => {
  return db.define(
    "accounts",
    {
      [AccountsColumn.Id]: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      [AccountsColumn.AccessToken]: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      [AccountsColumn.Status]: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      [AccountsColumn.IsActive]: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: false,
      },
      [AccountsColumn.TrackAttributeId]: {
        type: DataTypes.STRING,
      },
      [AccountsColumn.PersonFrom]: {
        type: DataTypes.STRING,
      },
      [AccountsColumn.PhoneFrom]: {
        type: DataTypes.STRING,
      },
      [AccountsColumn.ZipFrom]: {
        type: DataTypes.STRING,
      },
      [AccountsColumn.AddressFrom]: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName,
    }
  );
};
