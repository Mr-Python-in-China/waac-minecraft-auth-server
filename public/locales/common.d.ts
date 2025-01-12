import type ResponseErrors from "@src/ResponseErrors";

type ErrorMessages = {
  [k in keyof ResponseErrors]-?: string;
};

export default interface Message {
  error: ErrorMessages;
}
