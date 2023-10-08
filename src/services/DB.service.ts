import _ from "lodash";
import { Op, QueryTypes } from "sequelize";

import { db } from "@/config/db";
import { defineAccountsTable } from "@/shared/helpers/defineDbModel";

import { DbTable, AccountsColumn, ErrorMsgs, DbData } from "@/shared/types";

type Where = {
  [column in AccountsColumn]?: {
    [o in keyof typeof Op as symbol]: string | number;
  };
};

type TableOperations = {
  accountId: string;
  table: DbTable;
};

type CreateRow = TableOperations & {
  dbData: DbData;
  objectId: string;
};

type UpdateRow = TableOperations & {
  table: DbTable;
  dbData: DbData;
  where: Where;
};

type GetRow = TableOperations & {
  getColumns: Array<AccountsColumn>;
  where?: Where;
};

type RawQuery = {
  table: DbTable;
  queryString: string;
  queryType: QueryTypes;
  accountId?: string;
};

type DeleteRow = TableOperations & { objectId: string };

function defineModel(table: DbTable, accountId?: string) {
  if (table !== DbTable.Accounts && !accountId) return null;

  switch (table) {
    case DbTable.Accounts:
      return defineAccountsTable(DbTable.Accounts);
    default:
      return null;
  }
}

class DBServiceClass {
  async createRow(data: CreateRow) {
    const { table, accountId, objectId, dbData } = data;

    const Model = defineModel(table, accountId);
    if (!Model) {
      throw new Error("Cannot update DB. Not enough data.");
    }
    return Model.bulkCreate(
      [
        {
          id: objectId,
          ...dbData,
        },
      ]
      // {
      //   updateOnDuplicate: [],
      // }
    ).catch((err) => {
      throw err;
    });
  }

  async updateRow(data: UpdateRow) {
    const { table, accountId, dbData, where } = data;

    const Model = defineModel(table, accountId);
    if (!Model) {
      throw new Error("Cannot update DB. Not enough data.");
    }

    return Model.update(dbData, { where }).catch((err) => {
      throw err;
    });
  }

  async getRow(data: GetRow) {
    const { accountId, table, getColumns } = data;
    const where = data.where || {};

    const Model = defineModel(table, accountId);
    if (!Model) {
      throw new Error(ErrorMsgs.NoDbModel);
    }

    return Model.findAll({
      attributes: [...getColumns],
      where,
    })
      .then((result) => {
        if (result[0] && result[0].hasOwnProperty("dataValues")) {
          return result[0].dataValues;
        } else return null;
      })
      .catch((err) => {
        throw err;
      });
  }

  async rawQuery(data: RawQuery) {
    const { table, accountId, queryType, queryString } = data;

    const Model = defineModel(table, accountId);

    if (!Model) {
      throw new Error("Cannot update DB. Not enough data.");
    }
    let type = QueryTypes.SELECT;
    switch (queryType) {
      case QueryTypes.INSERT:
        type = QueryTypes.INSERT;
        break;
      case QueryTypes.UPDATE:
        type = QueryTypes.UPDATE;
        break;
      default:
        break;
    }

    return db
      .query(queryString, {
        mapToModel: true,
        model: Model,
        type,
      })
      .catch((err) => {
        throw err;
      });
  }

  async deleteRow(data: DeleteRow) {
    const { table, accountId, objectId } = data;

    const Model = defineModel(table, accountId);
    if (!Model) {
      throw new Error("Cannot update DB. Not enough data.");
    }
    return Model.destroy({
      where: { id: objectId },
    }).catch((err) => {
      throw err;
    });
  }

  async truncateTable(data: TableOperations) {
    const { table, accountId } = data;

    const Model = defineModel(table, accountId);
    if (!Model) {
      throw new Error("Cannot update DB. Not enough data.");
    }
    return Model.destroy({ truncate: true }).catch((err) => {
      throw err;
    });
  }

  async dropTable(data: TableOperations) {
    const { table, accountId } = data;

    const Model = defineModel(table, accountId);
    if (!Model) {
      throw new Error("Cannot update DB. Not enough data.");
    }
    return Model.drop().catch((err) => {
      throw err;
    });
  }
}

export const DBService = new DBServiceClass();
export type { Where };
