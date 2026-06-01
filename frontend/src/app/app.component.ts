import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MercadaoApiService } from "./mercadao-api.service";
import { Pedido, Produto } from "./modelos";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css"
})
export class AppComponent implements OnInit {
  produtos: Produto[] = [];
  pedidos: Pedido[] = [];
  pedidoAtual: Pedido | null = null;
  produtoSelecionado = "";
  quantidade = 1;
  enderecoEntrega = "Rua das Flores, 120 - Centro";
  mensagem = "";
  erro = false;
  carregando = false;

  constructor(private readonly api: MercadaoApiService) {}

  ngOnInit(): void {
    this.carregarTela();
  }

  carregarTela(): void {
    this.carregarProdutos();
    this.carregarPedidos();
  }

  carregarProdutos(): void {
    this.api.listarProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.produtoSelecionado ||= produtos[0]?.id ?? "";
      },
      error: () => this.mostrarMensagem("Nao foi possivel carregar os produtos.", true)
    });
  }

  carregarPedidos(): void {
    this.api.listarPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
      },
      error: () => this.mostrarMensagem("Nao foi possivel carregar os pedidos.", true)
    });
  }

  criarPedido(): void {
    this.mostrarMensagem("");
    this.carregando = true;

    this.api
      .criarPedido({
        compradorId: "comp-001",
        enderecoEntrega: this.enderecoEntrega,
        itens: [{ produtoId: this.produtoSelecionado, quantidade: this.quantidade }]
      })
      .subscribe({
        next: (pedido) => {
          this.pedidoAtual = pedido;
          this.carregando = false;
          this.carregarPedidos();
          this.mostrarMensagem("Pedido criado. Agora confirme o pagamento simulado.");
        },
        error: (resposta) => {
          this.carregando = false;
          this.mostrarMensagem(resposta.error?.error ?? "Nao foi possivel criar o pedido.", true);
        }
      });
  }

  pagarPedido(): void {
    if (!this.pedidoAtual) {
      return;
    }

    this.carregando = true;
    this.api.pagarPedido(this.pedidoAtual.id).subscribe({
      next: (resultado) => {
        this.pedidoAtual = resultado.pedido;
        this.carregando = false;
        this.carregarTela();
        this.mostrarMensagem("Pagamento aprovado e estoque atualizado.");
      },
      error: (resposta) => {
        this.carregando = false;
        this.mostrarMensagem(resposta.error?.error ?? "Nao foi possivel pagar o pedido.", true);
      }
    });
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(valor);
  }

  private mostrarMensagem(texto: string, erro = false): void {
    this.mensagem = texto;
    this.erro = erro;
  }
}
