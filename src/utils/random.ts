export function randomRegisterSession() {
  const randomBytes = crypto.getRandomValues(new Uint8Array(12));
  return "WaacRegisterSession_" + Buffer.from(randomBytes).toString("base64");
}
export function randomSalt() {
  return crypto.getRandomValues(new Uint8Array(32));
}
export function randomUserSession() {
  const randomBytes = crypto.getRandomValues(new Uint8Array(16));
  return Buffer.from(randomBytes).toString("base64");
}
