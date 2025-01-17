import { NextResponse } from "next/server";
import ErrorRespnseTypes from "./ErrorRespnseTypes";
import { merge as mergeObject } from "lodash";

export function responseError<S extends keyof ErrorRespnseTypes>(
  code: number,
  type: S,
  data: ErrorRespnseTypes[S],
  config?: ResponseInit,
) {
  return NextResponse.json(
    { error: type, data },
    mergeObject(
      {
        status: code,
      },
      config,
    ),
  );
}

export function responseUnknownError<D>(data?: D, config?: ResponseInit) {
  return NextResponse.json(
    { error: "UnknownError", data },
    mergeObject(
      {
        status: 500,
      },
      config,
    ),
  );
}
