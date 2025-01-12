import ErrorRespnseTypes from "./ErrorRespnseTypes";
import { merge as mergeObject } from "lodash";

export function responseOK(data: unknown, config?: ResponseInit) {
  return new Response(
    JSON.stringify(data),
    mergeObject(
      {
        headers: { type: "application/json" },
        status: 200,
      },
      config
    )
  );
}

export function responseError<S extends keyof ErrorRespnseTypes>(
  code: number,
  type: S,
  data: ErrorRespnseTypes[S],
  config?: ResponseInit
) {
  return new Response(
    JSON.stringify({ error: type, data }),
    mergeObject(
      {
        headers: { type: "application/json" },
        status: code,
      },
      config
    )
  );
}

export function response500(data?: unknown, config?: ResponseInit) {
  return new Response(
    JSON.stringify({ error: "Unknown Error", data }),
    mergeObject(
      {
        headers: { type: "application/json" },
        status: 500,
      },
      config
    )
  );
}
