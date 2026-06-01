export class ListarPedidosServico {
  constructor(pedidoRepositorio) {
    this.pedidoRepositorio = pedidoRepositorio;
  }

  async executar() {
    return this.pedidoRepositorio.listarTodos();
  }
}
