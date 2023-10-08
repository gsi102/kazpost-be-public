import { defineAccountsTable } from "@/shared/helpers/defineDbModel";

import { AccountsColumn, DbTable } from "@/shared/types";

const Account = defineAccountsTable(DbTable.Accounts);

class VendorServiceClass {
  async installApp(accountId: string, status: string, tokenEncrypted: string) {
    Account.bulkCreate(
      [
        {
          [AccountsColumn.Id]: accountId,
          [AccountsColumn.AccessToken]: tokenEncrypted,
          [AccountsColumn.Status]: status,
        },
      ],
      {
        updateOnDuplicate: [AccountsColumn.AccessToken, AccountsColumn.Status],
      }
    ).catch((err) => {
      throw err;
    });
  }
  async deleteApp(accountId: string, status: string) {
    return Promise.all([
      Account.update(
        {
          [AccountsColumn.Status]: status,
          [AccountsColumn.IsActive]: 0,
        },
        {
          where: {
            id: accountId,
          },
        }
      ),
    ]).catch((err) => {
      throw err;
    });
  }
}

export const VendorService = new VendorServiceClass();
