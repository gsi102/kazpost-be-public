import CryptoJS from "crypto-js";

import { SECRET_ACCESS_TOKEN } from "@/config/secret";
import { REPLACE_SYMBOLS } from "@/shared/const";

export function encrypt(data: string): string {
  const ciphertext = CryptoJS.AES.encrypt(data, SECRET_ACCESS_TOKEN).toString();
  return ciphertext.replace(/\//g, REPLACE_SYMBOLS.Slash);
}
