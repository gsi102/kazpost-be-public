import _ from "lodash";

import { MOYSKLAD_API_URL } from "@/config/api";
import { Entity, Meta } from "@/shared/types";

type CreatedAttributeData = {
  meta: Pick<Meta, "href" | "type">;
  value: boolean | number | string | null;
};

export const createAttributeData = (
  id: string,
  entity: Entity,
  value: CreatedAttributeData["value"]
): CreatedAttributeData => {
  let href = MOYSKLAD_API_URL + "/entity/" + entity;
  href += "/metadata/attributes/" + id;

  const attribute: CreatedAttributeData = {
    meta: {
      href,
      type: "attributemetadata",
    },
    value,
  };

  return _.cloneDeep(attribute);
};

export type { CreatedAttributeData };
