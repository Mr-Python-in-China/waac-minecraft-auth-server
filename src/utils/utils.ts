export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

export function parseJsonOrUndefined(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch (e) {
    if (e instanceof SyntaxError) return undefined;
    throw e;
  }
}
