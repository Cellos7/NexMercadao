export class PedidoRepositorioMemoria {
  constructor(pedidosIniciais = []) {
    this.pedidos = new Map(pedidosIniciais.map((pedido) => [pedido.id, structuredClone(pedido)]));
  }

  async criar(pedido) {
    this.pedidos.set(pedido.id, structuredClone(pedido));
    return structuredClone(pedido);
  }

  async buscarPorId(id) {
    const pedido = this.pedidos.get(id);
    return pedido ? structuredClone(pedido) : null;
  }

  async listarTodos() {
    return Array.from(this.pedidos.values()).map((pedido) => structuredClone(pedido));
  }

  async atualizar(pedido) {
    this.pedidos.set(pedido.id, structuredClone(pedido));
    return structuredClone(pedido);
  }
}
