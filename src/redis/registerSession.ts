import client from ".";

export async function writeRegisterSession(Session: string) {
  await client.set("registerSession:" + Session, new Date().getTime(), {
    EX: 10 * 60, // 10 min
  });
}

export async function ValidateRegisterSession(Session: string) {
  return await client.exists("registerSession:" + Session);
}
