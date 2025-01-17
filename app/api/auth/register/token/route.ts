import errorHandler from "@src/handlers/errorHandler";
import { writeRegisterToken } from "@src/redis/registerToken";
import { randomRegisterToken } from "@src/utils/random";
import { NextResponse } from "next/server";

export const POST = errorHandler(async () => {
  const token = randomRegisterToken();
  await writeRegisterToken(token);
  return NextResponse.json({ token });
});
