import { createUser } from "@src/db/user";
import errorHandler from "@src/handlers/errorHandler";
import { ValidateRegisterToken } from "@src/redis/registerToken";
import { responseError } from "@src/response";
import { parseJsonOrUndefined } from "@src/utils/utils";
import axios from "axios";
import { NextResponse } from "next/server";

export const POST = errorHandler(async (req) => {
  const data: unknown = parseJsonOrUndefined(await req.text());
  if (data === undefined) return responseError(400, "InvalidJSON", {});
  if (
    typeof data !== "object" ||
    data === null ||
    !("lguid" in data) ||
    typeof data.lguid !== "number" ||
    !("token" in data) ||
    typeof data.token !== "string" ||
    !("name" in data) ||
    typeof data.name !== "string" ||
    !("password" in data) ||
    typeof data.password !== "string"
  )
    return responseError(400, "BadRequestFormat", {});
  if (!(await ValidateRegisterToken(data.token)))
    return responseError(403, "Register_InvalidToken", {});
  if (!/^[a-zA-Z_][a-zA-Z0-9_]{2,15}$/.test(data.name))
    return responseError(403, "Register_InvalidUsername", {});
  if (data.password.length < 8)
    return responseError(403, "Register_PasswordTooWeak", {});
  if (data.lguid <= 0 || data.lguid >= 1e9 || data.lguid % 1 !== 0)
    return responseError(403, "Register_LuoguUserNotFound", {});

  const res = (
    await axios.get(`https://www.luogu.com/user/${data.lguid}?_contentOnly`, {
      timeout: 3000,
    })
  ).data;
  if (res.code === 404 && res.currentData.errorMessage === "用户未找到")
    return responseError(403, "Register_LuoguUserNotFound", {});
  if (res.code !== 200)
    throw new Error("Unknown luogu response", { cause: res });
  if (res.currentData.user.slogan !== data.token)
    return responseError(403, "Register_LuoguValidateFailed", {});

  const user = await createUser(data.name, data.password, data.lguid);
  if (typeof user === "string") return responseError(403, user, {});
  return NextResponse.json(user);
});
