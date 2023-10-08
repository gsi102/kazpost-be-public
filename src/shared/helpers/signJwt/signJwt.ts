import jwt, { JwtPayload } from "jsonwebtoken";
import { v4 as uuid } from "uuid";

import { APP_UID, SECRET_VENDOR } from "@/config/secret";

export const signJwt = (): string | JwtPayload => {
  const now = Math.floor(new Date().getTime() / 1000);
  return jwt.sign(
    {
      sub: APP_UID,
      iat: now,
      jti: uuid(),
    },
    SECRET_VENDOR
  );
};
