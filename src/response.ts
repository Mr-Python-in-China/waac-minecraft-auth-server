import ResponseErrors from "./ResponseErrors";

export function responseOK(data: unknown) {
  return new Response(JSON.stringify(data), {
    headers: { type: "application/json" },
    status: 200,
  });
}

export function responseError<S extends keyof ResponseErrors>(
  code: number,
  type: S,
  data: ResponseErrors[S]
) {
  return new Response(JSON.stringify({ error: type, data }), {
    headers: { type: "application/json" },
    status: code,
  });
}

export function response500(data?: any) {
  return new Response(JSON.stringify({ error: "Unknown Error", data }), {
    headers: { type: "application/json" },
    status: 500,
  });
}
