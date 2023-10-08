import { Meta } from "@/shared/types/MoySklad/Common";

type EntityAttribute = {
  id: string;
  meta: Meta;
  name: string;
  type: AttributeType;
  required?: boolean;
  show?: boolean;
  value?: boolean | number | string | null;
};

type AttributeType =
  | "link"
  | "string"
  | "text"
  | "time"
  | "boolean"
  | "double"
  | "long";

export type { EntityAttribute, AttributeType };
