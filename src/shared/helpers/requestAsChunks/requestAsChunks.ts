import _ from "lodash";

import { PendingPromise } from "@/shared/helpers/PendingPromise";
import { FilterBy } from "@/shared/types";

type CbPromise = (args: any) => Promise<any>;
type Data = {
  arr: Array<unknown>;
  filterBy: FilterBy;
  cbPromise: CbPromise;
  args: any;
  itemsLimit: number;
};
type RequestAsChunks = (data: Data) => PendingPromise[];

const createChunk = (cbPromise: CbPromise, args: any) => {
  return new PendingPromise(async (res: any, rej: any) => {
    const data = await cbPromise({ ...args }).catch((err) => {
      rej(err);
    });
    return res(data);
  });
};

export const requestAsChunks: RequestAsChunks = ({
  arr,
  filterBy,
  cbPromise,
  args,
  itemsLimit,
}) => {
  const requests = new Array(0);
  while (arr.length) {
    const sliced = arr.splice(0, itemsLimit);
    const filter = sliced.reduce((filterStr, element) => {
      filterStr += filterBy + "=" + element + ";";
      return filterStr;
    }, "");
    const limit = sliced?.length;
    args = {
      ...args,
      filter,
      limit,
    };
    const requestPromiseItem = createChunk(cbPromise, args);
    requests.push(requestPromiseItem);
  }

  return _.cloneDeep(requests);
};
