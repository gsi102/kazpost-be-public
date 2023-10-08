import _ from "lodash";

import { SEQUILIZE_ALIASES } from "@/shared/const";

import { Where } from "@/services";
import { AccountsColumn } from "@/shared/types";

export const convertFilterForSequilize = (where?: Where) => {
  let result = {} as Where;
  if (where) {
    for (const [key, val] of Object.entries(where)) {
      result[key as AccountsColumn] = {};
      const linkToProp = result[key as AccountsColumn];

      for (let [sequlizeOperator, sequlizeValue] of Object.entries(val)) {
        if (linkToProp) {
          const symbolicProp = SEQUILIZE_ALIASES[sequlizeOperator];
          linkToProp[symbolicProp] = sequlizeValue as string | number;
        }
      }
    }
  }

  return _.mergeWith({}, result, (a, b) => {
    if (!_.isObject(b)) return b;
    //@ts-ignore
    return Array.isArray(a) ? [...a, ...b] : { ...a, ...b };
  });
};
