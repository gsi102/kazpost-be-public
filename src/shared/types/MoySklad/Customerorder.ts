import { Meta } from "@/shared/types/MoySklad/Common";
import { Counterparty } from "./Counterparty";
import { EntityAttribute } from "./Attributes";

type Customerorder = {
  id: string;
  meta: {
    meta: Meta;
  };
  accountId: string;
  owner: {
    meta: Meta;
  };
  shared: boolean;
  group: {
    meta: Meta;
  };
  updated: string;
  name: string;
  externalCode: string;
  moment: string;
  applicable: boolean;
  rate: {
    currency: {
      meta: Meta;
    };
  };
  sum: number;
  store?: {
    meta: Meta;
  };
  agent: Counterparty;
  organization: {
    meta: Meta;
  };
  state?: {
    meta: Meta;
  };
  created: string;
  printed: boolean;
  published: boolean;
  files: {
    meta: Meta;
  };
  positions: {
    meta: Meta;
  };
  vatEnabled: boolean;
  vatIncluded?: boolean;
  vatSum: number;
  payedSum: number;
  shippedSum: number;
  invoicedSum: number;
  reservedSum: number;
  shipmentAddress?: string;
  shipmentAddressFull?: {
    addInfo: string;
  };
  attributes?: Array<EntityAttribute>;
};

type OrderType<T extends string> = `${T}${",asc" | ",desc" | ""}`;

type OrderCustomerorder =
  | OrderType<"id">
  | OrderType<"syncId">
  | OrderType<"version">
  | OrderType<"updated">
  | OrderType<"updatedBy">
  | OrderType<"name">
  | OrderType<"description">
  | OrderType<"externalCode">
  | OrderType<"moment">
  | OrderType<"applicable">
  | OrderType<"sum">
  | OrderType<"created">
  | OrderType<"deliveryPlannedMoment">;

export type { Customerorder, OrderCustomerorder };
