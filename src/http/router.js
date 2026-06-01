import { readJsonBody, sendError, sendJson } from "./http-helpers.js";

export class Router {
  constructor(produtoControlador, pedidoControlador) {
    this.produtoControlador = produtoControlador;
    this.pedidoControlador = pedidoControlador;
  }

  async handle(req, res) {
    if (req.method === "OPTIONS") {
      sendJson(res, 204, {});
      return true;
    }

    const url = new URL(req.url, "http://localhost");

    try {
      if (req.method === "GET" && url.pathname === "/") {
        sendJson(res, 200, {
          nome: "NexLog Mercadao API",
          mensagem: "Backend rodando. O frontend Angular abre em http://localhost:4200.",
          rotas: [
            "GET /api/produtos",
            "POST /api/pedidos",
            "POST /api/pedidos/:id/pagar",
            "GET /api/pedidos"
          ]
        });
        return true;
      }

      if (req.method === "GET" && url.pathname === "/api/produtos") {
        const response = await this.produtoControlador.listar();
        sendJson(res, response.statusCode, response.body);
        return true;
      }

      if (req.method === "POST" && url.pathname === "/api/pedidos") {
        const response = await this.pedidoControlador.criar({ body: await readJsonBody(req) });
        sendJson(res, response.statusCode, response.body);
        return true;
      }

      const rotaPagamento = url.pathname.match(/^\/api\/pedidos\/([^/]+)\/pagar$/);
      if (req.method === "POST" && rotaPagamento) {
        const response = await this.pedidoControlador.pagar({ params: { id: rotaPagamento[1] } });
        sendJson(res, response.statusCode, response.body);
        return true;
      }

      if (req.method === "GET" && url.pathname === "/api/pedidos") {
        const response = await this.pedidoControlador.listar();
        sendJson(res, response.statusCode, response.body);
        return true;
      }

      return false;
    } catch (error) {
      sendError(res, error);
      return true;
    }
  }
}
