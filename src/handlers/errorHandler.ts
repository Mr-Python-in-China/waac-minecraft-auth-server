import logger from "@src/log";
import { responseUnknownError } from "@src/response";
import { NextRequest, NextResponse } from "next/server";

function errorHandler(
  f: (req: NextRequest) => Promise<NextResponse>
): (req: NextRequest) => Promise<NextResponse>;

function errorHandler(
  f: (req: NextRequest) => NextResponse
): (req: NextRequest) => NextResponse;

function errorHandler(
  f:
    | ((req: NextRequest) => Promise<NextResponse>)
    | ((req: NextRequest) => NextResponse)
) {
  return (req: NextRequest) => {
    try {
      const r = f(req);
      if (!(r instanceof Promise)) return r;
      return r.catch((e) => {
        logger.error("Unknown error in handler.", {
          request: req,
          error: e,
        });
        return responseUnknownError();
      });
    } catch (e) {
      logger.error(
        "Unknown error happend.",
        {
          request: req,
          error: e,
        }
      );
      return responseUnknownError();
    }
  };
}

export default errorHandler;
