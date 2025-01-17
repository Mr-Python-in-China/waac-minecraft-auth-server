import { validateUserLogin } from "@src/db/user";
import errorHandler from "@src/handlers/errorHandler";
import { writeUserSession } from "@src/redis/userSession";
import { responseError } from "@src/response";
import { randomUserSession } from "@src/utils/random";
import { parseJsonOrUndefined } from "@src/utils/utils";
import { NextResponse } from "next/server";

export const POST = errorHandler(async (req) => {
  const data: unknown = parseJsonOrUndefined(await req.text());
  if (data === undefined) return responseError(400, "InvalidJSON", {});
  if (
    typeof data !== "object" ||
    data === null ||
    !("user" in data) ||
    typeof data.user !== "string" ||
    !("password" in data) ||
    typeof data.password !== "string"
  )
    return responseError(400, "BadRequestFormat", {});
  const res = await validateUserLogin(data.user, data.password);
  if (typeof res === "string") return responseError(403, res, {});
  const session = randomUserSession();
  writeUserSession(session, res);
  const rsp = NextResponse.json({});
  rsp.cookies.set("session", session, {
    maxAge: 15 * 24 * 60 * 60, // 15 days,
    httpOnly: true,
  });
  return rsp;
});
