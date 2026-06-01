export class PedidoControlador {
  constructor(criarPedidoServico, pagarPedidoServico, listarPedidosServico) {
    this.criarPedidoServico = criarPedidoServico;
    this.pagarPedidoServico = pagarPedidoServico;
    this.listarPedidosServico = listarPedidosServico;
  }

  async criar(request) {
    return {
      statusCode: 201,
      body: await this.criarPedidoServico.executar(normalizarPedido(request.body))
    };
  }

  async pagar(request) {
    return {
      statusCode: 200,
      body: await this.pagarPedidoServico.executar(request.params.id)
    };
  }

  async listar() {
    return {
      statusCode: 200,
      body: await this.listarPedidosServico.executar()
    };
  }
}

function normalizarPedido(body) {
  return {
    compradorId: body.compradorId,
    enderecoEntrega: body.enderecoEntrega,
    itens: (body.itens ?? []).map((item) => ({
      produtoId: item.produtoId,
      quantidade: item.quantidade
    }))
  };
}
