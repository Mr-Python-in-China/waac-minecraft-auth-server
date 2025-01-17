export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

export async function saltPassword(password: string, salt: Uint8Array) {
  const bytePassword = new TextEncoder().encode(password);
  for (let i = 0; i < bytePassword.length; ++i) bytePassword[i] ^= salt[i % 32];
  const arr = await crypto.subtle.digest("SHA-256", bytePassword);
  return new Uint8Array(arr);
}

export function parseJsonOrUndefined(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch (e) {
    if (e instanceof SyntaxError) return undefined;
    throw e;
  }
}
