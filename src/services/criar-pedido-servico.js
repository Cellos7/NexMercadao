import { ErroDeNegocio } from "../domain/erro-negocio.js";
import { StatusPedido } from "../domain/status-pedido.js";

export class CriarPedidoServico {
  constructor(produtoRepositorio, pedidoRepositorio, geradorId) {
    this.produtoRepositorio = produtoRepositorio;
    this.pedidoRepositorio = pedidoRepositorio;
    this.geradorId = geradorId;
  }

  async executar(dados) {
    this.validarDados(dados);

    const idsProdutos = dados.itens.map((item) => item.produtoId);
    const produtos = await this.produtoRepositorio.buscarPorIds(idsProdutos);

    if (produtos.length !== new Set(idsProdutos).size) {
      throw new ErroDeNegocio("Um ou mais produtos informados nao existem.", 404);
    }

    const fornecedores = new Set(produtos.map((produto) => produto.fornecedorId));
    if (fornecedores.size > 1) {
      throw new ErroDeNegocio("Cada pedido deve conter produtos de apenas um fornecedor.");
    }

    const itens = dados.itens.map((item) => {
      const produto = produtos.find((produtoAtual) => produtoAtual.id === item.produtoId);

      if (item.quantidade > produto.estoque) {
        throw new ErroDeNegocio(`Estoque insuficiente para o produto ${produto.nome}.`);
      }

      return {
        produtoId: produto.id,
        nomeProduto: produto.nome,
        quantidade: item.quantidade,
        precoUnitario: produto.preco,
        subtotal: Number((produto.preco * item.quantidade).toFixed(2))
      };
    });

    const total = Number(itens.reduce((soma, item) => soma + item.subtotal, 0).toFixed(2));
    const pedido = {
      id: this.geradorId.proximo("ped"),
      compradorId: dados.compradorId,
      fornecedorId: produtos[0].fornecedorId,
      enderecoEntrega: dados.enderecoEntrega.trim(),
      status: StatusPedido.CRIADO,
      total,
      itens,
      criadoEm: new Date().toISOString(),
      pagoEm: null
    };

    return this.pedidoRepositorio.criar(pedido);
  }

  validarDados(dados) {
    if (!dados?.compradorId) {
      throw new ErroDeNegocio("Comprador e obrigatorio.");
    }

    if (!dados?.enderecoEntrega || !dados.enderecoEntrega.trim()) {
      throw new ErroDeNegocio("Endereco de entrega e obrigatorio.");
    }

    if (!Array.isArray(dados.itens) || dados.itens.length === 0) {
      throw new ErroDeNegocio("O pedido deve possuir ao menos um item.");
    }

    for (const item of dados.itens) {
      if (!item.produtoId || !Number.isInteger(item.quantidade) || item.quantidade <= 0) {
        throw new ErroDeNegocio("Cada item deve possuir produto e quantidade inteira positiva.");
      }
    }
  }
}
