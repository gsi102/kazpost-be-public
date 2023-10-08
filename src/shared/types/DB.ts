enum DbTable {
  Accounts = "accounts",
}
enum AccountsColumn {
  Id = "id",
  AccessToken = "accessToken",
  Status = "status",
  IsActive = "isActive",
  TrackAttributeId = "trackAttributeId",
  PersonFrom = "personFrom",
  PhoneFrom = "phoneFrom",
  ZipFrom = "zipFrom",
  AddressFrom = "addressFrom",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

type DbData = {
  [col in AccountsColumn]?: string[] | number | string | boolean | null;
};

export { DbTable, AccountsColumn };

export type { DbData };
