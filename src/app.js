import { createServer } from "node:http";
import { ProdutoControlador } from "./controllers/produto-controlador.js";
import { PedidoControlador } from "./controllers/pedido-controlador.js";
import { PedidoRepositorioMemoria } from "./repositories/pedido-repositorio-memoria.js";
import { PedidoRepositorioPostgres } from "./repositories/pedido-repositorio-postgres.js";
import { PagamentoRepositorioMemoria } from "./repositories/pagamento-repositorio-memoria.js";
import { PagamentoRepositorioPostgres } from "./repositories/pagamento-repositorio-postgres.js";
import { ProdutoRepositorioMemoria } from "./repositories/produto-repositorio-memoria.js";
import { ProdutoRepositorioPostgres } from "./repositories/produto-repositorio-postgres.js";
import { CriarPedidoServico } from "./services/criar-pedido-servico.js";
import { GeradorId } from "./services/gerador-id.js";
import { ListarPedidosServico } from "./services/listar-pedidos-servico.js";
import { PagarPedidoServico } from "./services/pagar-pedido-servico.js";
import { ListarProdutosServico } from "./services/listar-produtos-servico.js";
import { Router } from "./http/router.js";
import { sendJson } from "./http/http-helpers.js";

export function buildApp() {
  const geradorId = new GeradorId();
  const repositorios = criarRepositorios();
  const produtoRepositorio = repositorios.produtoRepositorio;
  const pedidoRepositorio = repositorios.pedidoRepositorio;
  const pagamentoRepositorio = repositorios.pagamentoRepositorio;

  const listarProdutosServico = new ListarProdutosServico(produtoRepositorio);
  const criarPedidoServico = new CriarPedidoServico(produtoRepositorio, pedidoRepositorio, geradorId);
  const pagarPedidoServico = new PagarPedidoServico(pedidoRepositorio, pagamentoRepositorio, produtoRepositorio, geradorId);
  const listarPedidosServico = new ListarPedidosServico(pedidoRepositorio);

  const produtoControlador = new ProdutoControlador(listarProdutosServico);
  const pedidoControlador = new PedidoControlador(criarPedidoServico, pagarPedidoServico, listarPedidosServico);
  const router = new Router(produtoControlador, pedidoControlador);

  return createServer(async (req, res) => {
    const handledByApi = await router.handle(req, res);
    if (handledByApi) {
      return;
    }

    sendJson(res, 404, { error: "Rota nao encontrada." });
  });
}

function criarRepositorios() {
  if (process.env.DATABASE_URL) {
    return {
      produtoRepositorio: new ProdutoRepositorioPostgres(),
      pedidoRepositorio: new PedidoRepositorioPostgres(),
      pagamentoRepositorio: new PagamentoRepositorioPostgres()
    };
  }

  return {
    produtoRepositorio: new ProdutoRepositorioMemoria(criarProdutosIniciais()),
    pedidoRepositorio: new PedidoRepositorioMemoria(),
    pagamentoRepositorio: new PagamentoRepositorioMemoria()
  };
}

function criarProdutosIniciais() {
  return [
    {
      id: "prod-001",
      fornecedorId: "forn-001",
      nomeFornecedor: "Distribuidora Sol",
      nome: "Arroz Tipo 1 5kg",
      preco: 24.9,
      estoque: 35,
      perecivel: false
    },
    {
      id: "prod-002",
      fornecedorId: "forn-001",
      nomeFornecedor: "Distribuidora Sol",
      nome: "Feijao Carioca 1kg",
      preco: 8.49,
      estoque: 50,
      perecivel: false
    },
    {
      id: "prod-003",
      fornecedorId: "forn-002",
      nomeFornecedor: "Frios Norte",
      nome: "Iogurte Natural 900g",
      preco: 12.7,
      estoque: 18,
      perecivel: true
    }
  ];
}
