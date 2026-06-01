import { executarQuery } from "../database/conexao-postgres.js";

export class PedidoRepositorioPostgres {
  async criar(pedido) {
    await executarQuery(`
      INSERT INTO pedidos (id, comprador_id, fornecedor_id, endereco_entrega, status, total, criado_em, pago_em)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      pedido.id,
      pedido.compradorId,
      pedido.fornecedorId,
      pedido.enderecoEntrega,
      pedido.status,
      pedido.total,
      pedido.criadoEm,
      pedido.pagoEm
    ]);

    for (const item of pedido.itens) {
      await executarQuery(`
        INSERT INTO itens_pedido (pedido_id, produto_id, nome_produto, quantidade, preco_unitario, subtotal)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        pedido.id,
        item.produtoId,
        item.nomeProduto,
        item.quantidade,
        item.precoUnitario,
        item.subtotal
      ]);
    }

    return pedido;
  }

  async buscarPorId(id) {
    const resultado = await executarQuery(`
      SELECT id, comprador_id, fornecedor_id, endereco_entrega, status, total, criado_em, pago_em
      FROM pedidos
      WHERE id = $1
    `, [id]);

    if (resultado.rows.length === 0) {
      return null;
    }

    return this.montarPedido(resultado.rows[0]);
  }

  async listarTodos() {
    const resultado = await executarQuery(`
      SELECT id, comprador_id, fornecedor_id, endereco_entrega, status, total, criado_em, pago_em
      FROM pedidos
      ORDER BY criado_em DESC
    `);

    const pedidos = [];
    for (const row of resultado.rows) {
      pedidos.push(await this.montarPedido(row));
    }

    return pedidos;
  }

  async atualizar(pedido) {
    await executarQuery(`
      UPDATE pedidos
      SET status = $1, pago_em = $2
      WHERE id = $3
    `, [pedido.status, pedido.pagoEm, pedido.id]);

    return pedido;
  }

  async montarPedido(row) {
    const itens = await executarQuery(`
      SELECT produto_id, nome_produto, quantidade, preco_unitario, subtotal
      FROM itens_pedido
      WHERE pedido_id = $1
      ORDER BY id
    `, [row.id]);

    return {
      id: row.id,
      compradorId: row.comprador_id,
      fornecedorId: row.fornecedor_id,
      enderecoEntrega: row.endereco_entrega,
      status: row.status,
      total: Number(row.total),
      itens: itens.rows.map((item) => ({
        produtoId: item.produto_id,
        nomeProduto: item.nome_produto,
        quantidade: item.quantidade,
        precoUnitario: Number(item.preco_unitario),
        subtotal: Number(item.subtotal)
      })),
      criadoEm: new Date(row.criado_em).toISOString(),
      pagoEm: row.pago_em ? new Date(row.pago_em).toISOString() : null
    };
  }
}
