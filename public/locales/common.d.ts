import type ErrorRespnseTypes from "@src/ErrorRespnseTypes";

type ErrorMessages = {
  [k in keyof ErrorRespnseTypes]-?: string;
};

export default interface Message {
  error: ErrorMessages;
}
