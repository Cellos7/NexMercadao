import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { StatusPedido } from "../src/domain/status-pedido.js";
import { PedidoRepositorioMemoria } from "../src/repositories/pedido-repositorio-memoria.js";
import { PagamentoRepositorioMemoria } from "../src/repositories/pagamento-repositorio-memoria.js";
import { ProdutoRepositorioMemoria } from "../src/repositories/produto-repositorio-memoria.js";
import { GeradorId } from "../src/services/gerador-id.js";
import { PagarPedidoServico } from "../src/services/pagar-pedido-servico.js";

describe("UC03 - Pagamento simulado", () => {
  it("aprova pagamento e desconta estoque do produto", async () => {
    const produtoRepositorio = new ProdutoRepositorioMemoria([
      { id: "prod-001", fornecedorId: "forn-001", nome: "Arroz", preco: 24.9, estoque: 10 }
    ]);
    const pedidoRepositorio = new PedidoRepositorioMemoria([
      {
        id: "ped-0001",
        compradorId: "comp-001",
        fornecedorId: "forn-001",
        enderecoEntrega: "Rua A, 10",
        status: StatusPedido.CRIADO,
        total: 49.8,
        itens: [{ produtoId: "prod-001", nomeProduto: "Arroz", quantidade: 2, precoUnitario: 24.9, subtotal: 49.8 }],
        criadoEm: new Date().toISOString(),
        pagoEm: null
      }
    ]);
    const servico = new PagarPedidoServico(
      pedidoRepositorio,
      new PagamentoRepositorioMemoria(),
      produtoRepositorio,
      new GeradorId()
    );

    const resultado = await servico.executar("ped-0001");
    const produtos = await produtoRepositorio.listarTodos();

    assert.equal(resultado.pedido.status, StatusPedido.PAGO);
    assert.equal(resultado.pagamento.status, "APROVADO");
    assert.equal(produtos[0].estoque, 8);
  });

  it("nao permite pagar duas vezes o mesmo pedido", async () => {
    const produtoRepositorio = new ProdutoRepositorioMemoria([
      { id: "prod-001", fornecedorId: "forn-001", nome: "Arroz", preco: 24.9, estoque: 10 }
    ]);
    const pedidoRepositorio = new PedidoRepositorioMemoria([
      {
        id: "ped-0001",
        compradorId: "comp-001",
        fornecedorId: "forn-001",
        enderecoEntrega: "Rua A, 10",
        status: StatusPedido.PAGO,
        total: 49.8,
        itens: [{ produtoId: "prod-001", nomeProduto: "Arroz", quantidade: 2, precoUnitario: 24.9, subtotal: 49.8 }],
        criadoEm: new Date().toISOString(),
        pagoEm: new Date().toISOString()
      }
    ]);
    const servico = new PagarPedidoServico(
      pedidoRepositorio,
      new PagamentoRepositorioMemoria(),
      produtoRepositorio,
      new GeradorId()
    );

    await assert.rejects(() => servico.executar("ped-0001"), /ja foi pago/);
  });
});
