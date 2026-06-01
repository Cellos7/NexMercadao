import { ErroDeNegocio } from "../domain/erro-negocio.js";
import { StatusPedido } from "../domain/status-pedido.js";

export class PagarPedidoServico {
  constructor(pedidoRepositorio, pagamentoRepositorio, produtoRepositorio, geradorId) {
    this.pedidoRepositorio = pedidoRepositorio;
    this.pagamentoRepositorio = pagamentoRepositorio;
    this.produtoRepositorio = produtoRepositorio;
    this.geradorId = geradorId;
  }

  async executar(pedidoId) {
    const pedido = await this.pedidoRepositorio.buscarPorId(pedidoId);

    if (!pedido) {
      throw new ErroDeNegocio("Pedido nao encontrado.", 404);
    }

    if (pedido.status === StatusPedido.PAGO) {
      throw new ErroDeNegocio("Pedido ja foi pago.");
    }

    await this.produtoRepositorio.baixarEstoque(pedido.itens);

    const pedidoPago = {
      ...pedido,
      status: StatusPedido.PAGO,
      pagoEm: new Date().toISOString()
    };

    const pagamento = {
      id: this.geradorId.proximo("pag"),
      pedidoId,
      status: "APROVADO",
      valor: pedido.total,
      pagoEm: pedidoPago.pagoEm
    };

    await this.pagamentoRepositorio.criar(pagamento);
    await this.pedidoRepositorio.atualizar(pedidoPago);

    return { pedido: pedidoPago, pagamento };
  }
}
