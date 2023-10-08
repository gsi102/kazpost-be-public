enum Entity {
  Customerorder = "customerorder",
  Demand = "demand",
  Move = "move",
  Product = "product",
  Bundle = "bundle",
  Bundlecomponent = "bundlecomponent",
  Service = "service",
  Store = "store",
  Saleschannel = "saleschannel",
  Salesreturn = "salesreturn",
  Counterparty = "counterparty",
  Productfolder = "productfolder",
  Employee = "employee",
  Group = "group",
  Currency = "currency",
  Organization = "organization",
  State = "state",
  Files = "files",
  Customerorderposition = "customerorderposition",
  Account = "account",
  Attributemetadata = "attributemetadata",
}
const EntityName: { [k in Entity]?: string } = {
  customerorder: "Заказ покупателя",
  demand: "Отгрузка",
  move: "Перемещение",
  salesreturn: "Возврат покупателя",
};

enum EntityData {
  Metadata = "metadata",
  Audit = "audit",
  Positions = "positions",
  Attributes = "metadata/attributes",
  Applicable = "applicable",
  State = "state",
  Tags = "tags",
  SalesChannel = "salesChannel",
  Agent = "agent",
  Name = "name",
  Store = "store",
  Components = "components",
}

export { Entity, EntityName, EntityData };
