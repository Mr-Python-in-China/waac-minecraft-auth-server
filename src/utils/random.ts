export function randomRegisterToken() {
  const randomBytes = crypto.getRandomValues(new Uint8Array(12));
  return "WaacRegisterToken_" + Buffer.from(randomBytes).toString("base64");
}
export function randomSalt() {
  return crypto.getRandomValues(new Uint8Array(32));
}
