import { Meta } from "./Common";

type Counterparty = {
  accountId: string;
  accounts: {
    meta: Meta;
  };
  archived: boolean;
  companyType: "legal" | "entrepreneur" | "individual";
  contactpersons?: { meta: Meta };
  created: string;
  externalCode: string;
  files: { meta: Meta };
  group: { meta: Meta };
  id: string;
  inn?: string;
  kpp?: string;
  legalAddress?: string;
  legalAddressFull?: { addInfo: string };
  legalTitle?: string;
  meta: Meta;
  name: string;
  notes?: { meta: Meta };
  owner?: { meta: Meta };
  salesAmount: number;
  shared: boolean;
  state?: { meta: Meta };
  tags?: Array<string>;
  updated: string;
};

export type { Counterparty };
