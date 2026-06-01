export class PagamentoRepositorioMemoria {
  constructor(pagamentosIniciais = []) {
    this.pagamentos = new Map(pagamentosIniciais.map((pagamento) => [pagamento.id, structuredClone(pagamento)]));
  }

  async criar(pagamento) {
    this.pagamentos.set(pagamento.id, structuredClone(pagamento));
    return structuredClone(pagamento);
  }

  async listarTodos() {
    return Array.from(this.pagamentos.values()).map((pagamento) => structuredClone(pagamento));
  }
}
