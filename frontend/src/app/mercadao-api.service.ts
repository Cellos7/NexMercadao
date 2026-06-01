import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Pedido, Produto, ResultadoPagamento } from "./modelos";

interface NovoPedido {
  compradorId: string;
  enderecoEntrega: string;
  itens: Array<{
    produtoId: string;
    quantidade: number;
  }>;
}

@Injectable({ providedIn: "root" })
export class MercadaoApiService {
  constructor(private readonly http: HttpClient) {}

  listarProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>("/api/produtos");
  }

  listarPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>("/api/pedidos");
  }

  criarPedido(pedido: NovoPedido): Observable<Pedido> {
    return this.http.post<Pedido>("/api/pedidos", pedido);
  }

  pagarPedido(pedidoId: string): Observable<ResultadoPagamento> {
    return this.http.post<ResultadoPagamento>(`/api/pedidos/${pedidoId}/pagar`, {});
  }
}
