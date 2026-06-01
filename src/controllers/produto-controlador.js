export class ProdutoControlador {
  constructor(listarProdutosServico) {
    this.listarProdutosServico = listarProdutosServico;
  }

  async listar() {
    return {
      statusCode: 200,
      body: await this.listarProdutosServico.executar()
    };
  }
}
