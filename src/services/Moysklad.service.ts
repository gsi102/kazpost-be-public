import axios from "axios";
import { JwtPayload } from "jsonwebtoken";
import _ from "lodash";
import { Op } from "sequelize";

import { signJwt } from "@/shared/helpers/signJwt";
import { decrypt } from "@/shared/helpers/decryption/AES";
import {
  DelayedRequest,
  delayedRequest,
  editLimits,
} from "@/shared/helpers/delayedRequest/";

import { DBService } from "@/services/";

import { MOYSKLAD_VENDOR_URL, MOYSKLAD_API_URL } from "@/config/api";
import { APP_ID } from "@/config/secret";

import {
  AccountsColumn,
  AppStatus,
  DbTable,
  Entity,
  EntityData,
} from "@/shared/types";

type GetEntityData = {
  entity?: Entity;
  entityId?: string;
  accessToken: string | JwtPayload;
  dataType?: EntityData;
  filter?: string;
  expand?: string;
  limit?: number;
  offset?: number;
  order?: string;
  search?: string;
};

type ChangeEntityData = {
  entity: Entity;
  objectId?: string;
  accessToken: string | JwtPayload;
  dataToUpdate: { [k: string]: any };
};

const defaultRequestLimits = {
  reset: null,
  retryTimeInterval: null,
  retryAfter: null,
  rateLimit: null,
  rateLimitRemaining: null,
};

const defaultStorage = {
  exponentDelayRatio: 1,
  keepCleanUpTimer: null,
};

class MoyskladServiceClass extends DelayedRequest<
  typeof defaultRequestLimits,
  typeof defaultStorage
> {
  constructor() {
    super();
    this.requestLimits = defaultRequestLimits;
    this.storage = defaultStorage;
  }

  async getAccessToken(accountId: string) {
    const table = DbTable.Accounts;
    const getColumns = [AccountsColumn.AccessToken];
    const where = {
      [AccountsColumn.Id]: {
        [Op.eq]: accountId,
      },
    };

    return DBService.getRow({
      table,
      accountId,
      getColumns,
      where,
    }).then((accountData: any) => {
      if (!accountData) throw Error("Bad request");
      const tokenEncrypted = accountData[AccountsColumn.AccessToken];
      return decrypt(tokenEncrypted);
    });
  }

  async updateAppStatus(
    accountId: string,
    status: AppStatus,
    jwtToken: string | JwtPayload
  ) {
    const url = MOYSKLAD_VENDOR_URL + `/apps/${APP_ID}/${accountId}/status`;
    const body = { status };
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    return axios
      .put(url, body, headers)
      .then((result) => result.data)
      .catch((err) => {
        throw err;
      });
  }

  async getContext(contextKey: string) {
    const token: string | JwtPayload = signJwt();

    const url = MOYSKLAD_VENDOR_URL + `/context/${contextKey}`;

    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return axios
      .post(url, {}, headers)
      .then((response) => response.data)
      .catch((err) => {
        throw err;
      });
  }

  @delayedRequest()
  @editLimits()
  async getEntityData(data: GetEntityData) {
    const {
      entity,
      entityId,
      accessToken,
      dataType,
      filter,
      expand,
      limit,
      offset,
      order,
      search,
    } = data;

    let url = MOYSKLAD_API_URL + `/entity`;

    if (entity) url += "/" + entity;
    if (entityId) url += "/" + entityId;
    if (dataType) url += "/" + dataType;

    if (limit) {
      url += url.includes("?") ? "&limit=" : "?limit=";
      url += limit;
    }
    if (offset || offset === 0) {
      url += url.includes("?") ? "&" : "?";
      url += "offset=" + offset;
    }
    if (order) {
      url += url.includes("?") ? "&" : "?";
      url += "order=" + order;
    }
    if (search) {
      url += url.includes("?") ? "&" : "?";
      url += "search=" + search;
    }
    if (filter) {
      url += url.includes("?") ? "&" : "?";
      url += "filter=" + filter;
    }
    if (expand) {
      url += url.includes("?") ? "&" : "?";
      url += "expand=" + expand;
    }
    const setHeaders = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      } as { [k: string]: string },
    };
    if (filter || expand) {
      setHeaders.headers = {
        ...setHeaders.headers,
        "Lognex-Pretty-Print-JSON": "true",
      };
    }

    return axios.get(url, setHeaders).catch((err) => {
      throw err;
    });
  }

  @delayedRequest()
  @editLimits()
  async changeEntityData(data: ChangeEntityData) {
    const { entity, objectId, accessToken, dataToUpdate } = data;

    let url = MOYSKLAD_API_URL + "/entity/" + entity;
    if (objectId) url += "/" + objectId;

    let body = dataToUpdate;

    const headers = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json;charset=utf-8",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    return axios.put(url, body, headers).catch((err) => {
      throw err;
    });
  }

  @delayedRequest()
  @editLimits()
  async bulkChangeEntityData(data: Omit<ChangeEntityData, "objectId">) {
    const { entity, accessToken, dataToUpdate } = data;

    let url = MOYSKLAD_API_URL + "/entity/" + entity;

    let body = dataToUpdate;

    const headers = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json;charset=utf-8",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    return axios.post(url, body, headers).catch((err) => {
      throw err;
    });
  }
}

export const MoyskladService = new MoyskladServiceClass();
