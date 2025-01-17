import errorHandler from "@src/handlers/errorHandler";
import { writeRegisterSession } from "@src/redis/registerSession";
import { randomRegisterSession } from "@src/utils/random";
import { NextResponse } from "next/server";

export const POST = errorHandler(async () => {
  const session = randomRegisterSession();
  await writeRegisterSession(session);
  return NextResponse.json({ session });
});
