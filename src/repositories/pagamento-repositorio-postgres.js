import { executarQuery } from "../database/conexao-postgres.js";

export class PagamentoRepositorioPostgres {
  async criar(pagamento) {
    await executarQuery(`
      INSERT INTO pagamentos (id, pedido_id, status, valor, pago_em)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      pagamento.id,
      pagamento.pedidoId,
      pagamento.status,
      pagamento.valor,
      pagamento.pagoEm
    ]);

    return pagamento;
  }

  async listarTodos() {
    const resultado = await executarQuery(`
      SELECT id, pedido_id, status, valor, pago_em
      FROM pagamentos
      ORDER BY pago_em DESC
    `);

    return resultado.rows.map((row) => ({
      id: row.id,
      pedidoId: row.pedido_id,
      status: row.status,
      valor: Number(row.valor),
      pagoEm: new Date(row.pago_em).toISOString()
    }));
  }
}
