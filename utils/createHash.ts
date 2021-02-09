import * as crypto from "crypto";
const secret = "secret";

export default function createHash(value: string) {
  return crypto.createHmac("sha256", secret)
    .update(value)
    .digest("hex")
}
