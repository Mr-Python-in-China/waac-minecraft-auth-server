import { randomSalt } from "./random";

export default async function saltPassword(password: string) {
  const bytePassword = new TextEncoder().encode(password);
  const salt = randomSalt();
  for (let i = 0; i < bytePassword.length; ++i) bytePassword[i] ^= salt[i % 32];
  const arr = await crypto.subtle.digest("SHA-256", bytePassword);
  return [new Uint8Array(arr), salt];
}
