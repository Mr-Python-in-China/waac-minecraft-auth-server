import type Message from "./common";

export default {
  error: {
    InvalidJSON: "JSON 不合法",
    BadRequestFormat: "请求格式错误",
    Register_LuoguUserNotFound: "在洛谷中找不到此用户",
    Register_InvalidSession: "未知 Session，可能已经过期，请刷新重新注册",
    Register_LuoguValidateFailed: "未在洛谷个人签名处发现 Session",
    Register_InvalidUsername: "用户名格式错误",
    Register_PasswordTooWeak: "密码过弱",
    Register_nameExists: "用户名已被占用",
    Register_LuoguUserExists: "洛谷用户已被绑定",
    Login_UserNotExits: "用户不存在",
    Login_PasswordIncorrect: "密码错误",
  },
} satisfies Message;
