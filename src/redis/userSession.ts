import client from ".";

export async function writeUserSession(Session: string, uid: number) {
  await client.set("userSession:" + Session, `${uid}`, {
    EX: 15 * 24 * 60 * 60, // 15 days
  });
}

export async function checkUserSession(Session: string) {
  const value = await client.get("userSession:" + Session);
  if (!value) return null;
  return parseInt(value);
}
