export interface Produto {
  id: string;
  fornecedorId: string;
  nomeFornecedor: string;
  nome: string;
  preco: number;
  estoque: number;
  perecivel: boolean;
}

export interface ItemPedido {
  produtoId: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: string;
  compradorId: string;
  fornecedorId: string;
  enderecoEntrega: string;
  status: "CRIADO" | "PAGO";
  total: number;
  itens: ItemPedido[];
  criadoEm: string;
  pagoEm: string | null;
}

export interface Pagamento {
  id: string;
  pedidoId: string;
  status: string;
  valor: number;
  pagoEm: string;
}

export interface ResultadoPagamento {
  pedido: Pedido;
  pagamento: Pagamento;
}
