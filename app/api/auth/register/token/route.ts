import { writeRegisterToken } from "@src/redis/registerToken";
import { randomRegisterToken } from "@src/utils/random";

export async function POST() {
  const token = randomRegisterToken();
  await writeRegisterToken(token);
  return new Response(JSON.stringify({ token }), {
    headers: { type: "application/json" },
  });
}
