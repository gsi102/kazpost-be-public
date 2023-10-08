import CryptoJS from "crypto-js";

import { SECRET_ACCESS_TOKEN } from "@/config/secret";
import { REPLACE_SYMBOLS } from "@/shared/const";

export function decrypt(ciphertext: string): string {
  const re = new RegExp(REPLACE_SYMBOLS.Slash, "g");
  const stringFromSQL = ciphertext.replace(re, "/");
  const bytes = CryptoJS.AES.decrypt(stringFromSQL, SECRET_ACCESS_TOKEN);
  return bytes.toString(CryptoJS.enc.Utf8);
}
