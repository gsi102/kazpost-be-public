import { Entity } from "./Entities";

type Meta = {
  href: string;
  metadataHref?: string;
  type: Entity | "attributemetadata";
  mediaType: "application/json";
  uuidHref?: string;
  size?: number;
  limit?: number;
  offset?: number;
};

type FilterBy = "id" | "name";

export type { Meta, FilterBy };
