import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PedidoRepositorioMemoria } from "../src/repositories/pedido-repositorio-memoria.js";
import { ProdutoRepositorioMemoria } from "../src/repositories/produto-repositorio-memoria.js";
import { CriarPedidoServico } from "../src/services/criar-pedido-servico.js";
import { GeradorId } from "../src/services/gerador-id.js";

describe("UC03 - Criar pedido", () => {
  it("cria pedido quando existe estoque e os produtos sao do mesmo fornecedor", async () => {
    const servico = criarServico();

    const pedido = await servico.executar({
      compradorId: "comp-001",
      enderecoEntrega: "Rua A, 10",
      itens: [
        { produtoId: "prod-001", quantidade: 2 },
        { produtoId: "prod-002", quantidade: 1 }
      ]
    });

    assert.equal(pedido.status, "CRIADO");
    assert.equal(pedido.fornecedorId, "forn-001");
    assert.equal(pedido.total, 58.29);
  });

  it("bloqueia pedido com quantidade maior que o estoque disponivel", async () => {
    const servico = criarServico();

    await assert.rejects(
      () => servico.executar({
        compradorId: "comp-001",
        enderecoEntrega: "Rua A, 10",
        itens: [{ produtoId: "prod-001", quantidade: 99 }]
      }),
      /Estoque insuficiente/
    );
  });

  it("bloqueia pedido com produtos de fornecedores diferentes", async () => {
    const servico = criarServico();

    await assert.rejects(
      () => servico.executar({
        compradorId: "comp-001",
        enderecoEntrega: "Rua A, 10",
        itens: [
          { produtoId: "prod-001", quantidade: 1 },
          { produtoId: "prod-003", quantidade: 1 }
        ]
      }),
      /apenas um fornecedor/
    );
  });
});

function criarServico() {
  const produtoRepositorio = new ProdutoRepositorioMemoria([
    { id: "prod-001", fornecedorId: "forn-001", nome: "Arroz", preco: 24.9, estoque: 10 },
    { id: "prod-002", fornecedorId: "forn-001", nome: "Feijao", preco: 8.49, estoque: 10 },
    { id: "prod-003", fornecedorId: "forn-002", nome: "Iogurte", preco: 12.7, estoque: 10 }
  ]);

  return new CriarPedidoServico(produtoRepositorio, new PedidoRepositorioMemoria(), new GeradorId());
}
