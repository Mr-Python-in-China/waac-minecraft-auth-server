import client from ".";

export async function writeRegisterToken(token: string) {
  await client.set("registerToken:" + token, new Date().toISOString(), {
    EX: 10 * 60, // 10 min
  });
}

export async function ValidateRegisterToken(token: string) {
  return await client.exists("registerToken:" + token);
}
