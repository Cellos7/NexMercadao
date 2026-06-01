export class ProdutoRepositorioMemoria {
  constructor(produtosIniciais = []) {
    this.produtos = new Map(produtosIniciais.map((produto) => [produto.id, { ...produto }]));
  }

  async listarTodos() {
    return Array.from(this.produtos.values()).map((produto) => ({ ...produto }));
  }

  async buscarPorIds(ids) {
    return ids
      .map((id) => this.produtos.get(id))
      .filter(Boolean)
      .map((produto) => ({ ...produto }));
  }

  async baixarEstoque(itens) {
    for (const item of itens) {
      const produto = this.produtos.get(item.produtoId);
      this.produtos.set(item.produtoId, {
        ...produto,
        estoque: produto.estoque - item.quantidade
      });
    }
  }
}
