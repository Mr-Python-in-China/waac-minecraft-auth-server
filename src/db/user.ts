import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from ".";
import { saltPassword } from "@src/utils/utils";
import { sleep } from "@src/utils/utils";
import logger from "@src/log";
import ErrorRespnseTypes from "@src/ErrorRespnseTypes";
import { randomSalt } from "@src/utils/random";

export async function createUser(
  name: string,
  password: string,
  lguid: number,
  retry = 0,
): Promise<{ id: number; name: string } | keyof ErrorRespnseTypes> {
  const salt = randomSalt();
  const saltedPassword = await saltPassword(password, salt);
  try {
    const len = await prisma.user.count();
    const v = await prisma.user.create({
      data: {
        id: len,
        name,
        password: saltedPassword,
        lguid,
        salt,
      },
    });
    logger.info(`Create user ${v.id} ${v.name}`);
    return { id: v.id, name: v.name };
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      if (e.meta?.target === "user_id_key")
        if (retry > 20)
          throw new Error("Try to create user too many times.", { cause: e });
        else {
          logger.info("Create user id conflict, retrying...", e);
          return await sleep(10).then(() =>
            createUser(name, password, lguid + 1, retry + 1),
          );
        }
      if (e.meta?.target === "user_name_key") return "Register_nameExists";
      if (e.meta?.target === "user_lguid_key")
        return "Register_LuoguUserExists";
    }
    throw e;
  }
}

export async function validateUserLogin(
  user: string,
  password: string,
): Promise<keyof ErrorRespnseTypes | number> {
  const data = await prisma.user.findUnique({
    where: /^\d+$/.test(user) ? { id: parseInt(user) } : { name: user },
  });
  if (data === null) return "Login_UserNotExits";
  const saltedPassword = await saltPassword(password, data.salt);
  for (let i = 0; i < 32; ++i)
    if (saltedPassword[i] !== data.password[i])
      return "Login_PasswordIncorrect";
  return data.id;
}
