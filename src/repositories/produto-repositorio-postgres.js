import { executarQuery } from "../database/conexao-postgres.js";

export class ProdutoRepositorioPostgres {
  async listarTodos() {
    const resultado = await executarQuery(`
      SELECT id, fornecedor_id, nome_fornecedor, nome, preco, estoque, perecivel
      FROM produtos
      ORDER BY nome
    `);

    return resultado.rows.map(mapearProduto);
  }

  async buscarPorIds(ids) {
    const resultado = await executarQuery(`
      SELECT id, fornecedor_id, nome_fornecedor, nome, preco, estoque, perecivel
      FROM produtos
      WHERE id = ANY($1)
    `, [ids]);

    return resultado.rows.map(mapearProduto);
  }

  async baixarEstoque(itens) {
    for (const item of itens) {
      await executarQuery(`
        UPDATE produtos
        SET estoque = estoque - $1
        WHERE id = $2
      `, [item.quantidade, item.produtoId]);
    }
  }
}

function mapearProduto(row) {
  return {
    id: row.id,
    fornecedorId: row.fornecedor_id,
    nomeFornecedor: row.nome_fornecedor,
    nome: row.nome,
    preco: Number(row.preco),
    estoque: row.estoque,
    perecivel: row.perecivel
  };
}
