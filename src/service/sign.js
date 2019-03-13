import {signUpSecret} from "../../src/config/env.js";
import {sha256} from "js-sha256";

export const signHeader = (url) => {
  let nonce = Date.now();
  let signature = sha256.hmac(signUpSecret, nonce + url);
  return { "X-App-Nonce": nonce, "X-App-Signature": signature};
}