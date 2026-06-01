export class ListarProdutosServico {
  constructor(produtoRepositorio) {
    this.produtoRepositorio = produtoRepositorio;
  }

  async executar() {
    return this.produtoRepositorio.listarTodos();
  }
}
