import { createUser } from "@src/db/user";
import logger from "@src/log";
import { ValidateRegisterToken } from "@src/redis/registerToken";
import {
  responseError as responseError,
  response500,
  responseOK,
} from "@src/response";
import axios from "axios";

export async function POST(req: Request): Promise<Response> {
  const text = await req.text();
  req.text = async () => text;
  req.json = async () => JSON.parse(text);
  try {
    const data: unknown = await req.json();
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

    try {
      const res = (
        await axios.get(
          `https://www.luogu.com/user/${data.lguid}?_contentOnly`,
          {
            timeout: 3000,
          }
        )
      ).data;
      if (res.code === 404 && res.currentData.errorMessage === "用户未找到")
        return responseError(403, "Register_LuoguUserNotFound", {});
      if (res.code !== 200)
        throw new Error("Unknown luogu response", { cause: res });
      if (res.currentData.user.slogan !== data.token)
        return responseError(403, "Register_LuoguValidateFailed", {});
    } catch (e) {
      logger.error(
        "Unknown error in POST /api/auth/register when fetch luogu.",
        {
          request: { ...req, text: await req.text() },
          error: e,
        }
      );
      return response500();
    }

    try {
      const user = await createUser(data.name, data.password, data.lguid);
      return responseOK(user);
    } catch (e) {
      if (
        e instanceof Error &&
        (e.message === "Register_nameExists" ||
          e.message === "Register_LuoguUserExists")
      )
        return responseError(403, e.message, {});
      throw e;
    }
  } catch (e) {
    if (e instanceof SyntaxError) {
      return responseError(400, "InvalidJSON", {});
    } else {
      logger.error("Unknown error in POST /api/auth/register.", {
        request: { ...req, text: await req.text() },
        error: e,
      });
      return response500();
    }
  }
}
