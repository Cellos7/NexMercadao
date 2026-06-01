import { ErroDeNegocio } from "../domain/erro-negocio.js";

export async function readJsonBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  return rawBody ? JSON.parse(rawBody) : {};
}

export function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(body));
}

export function sendError(res, error) {
  if (error instanceof SyntaxError) {
    sendJson(res, 400, { error: "JSON invalido." });
    return;
  }

  if (error instanceof ErroDeNegocio) {
    sendJson(res, error.codigoHttp, { error: error.message });
    return;
  }

  console.error(error);
  sendJson(res, 500, { error: "Erro interno do servidor." });
}
