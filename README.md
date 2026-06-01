# NexLog Mercadao - MVP UC03

MVP academico focado no caso de uso **UC03 - Realizar Pedido**.

O projeto demonstra integracao entre front-end Angular e back-end via API REST, com arquitetura em camadas e regras de negocio concentradas na camada de servicos.

## Escopo implementado

- Listagem de produtos disponiveis na vitrine
- Criacao de pedido pelo comprador
- Validacao de estoque disponivel
- Validacao de pedido com produtos de apenas um fornecedor
- Pagamento simulado
- Desconto de estoque no pagamento
- Historico simples de pedidos
- Testes automatizados do caso de uso escolhido

## Decisoes de MVP

- O banco foi representado por repositorios em memoria para reduzir dependencias e facilitar a demonstracao.
- A camada de repositorio isola o armazenamento, entao pode ser substituida por Prisma/PostgreSQL sem alterar controladores e servicos.
- Socket.IO, rastreamento, veiculos, rotas e despacho ficaram fora da implementacao porque o caso de uso escolhido e UC03.

## Rotas REST usadas no MVP

```text
GET  /api/produtos
POST /api/pedidos
POST /api/pedidos/:id/pagar
GET  /api/pedidos
```

## Como rodar

1. Suba o PostgreSQL pelo Docker:

```bash
docker compose up -d
```

2. Rode o backend com a variavel do banco:

```bash
set DATABASE_URL=postgres://nexlog:nexlog123@localhost:5432/nexlog_mercadao
npm install
npm start
```

No PowerShell, use:

```powershell
$env:DATABASE_URL="postgres://nexlog:nexlog123@localhost:5432/nexlog_mercadao"
npm install
npm start
```

3. Em outro terminal, rode o Angular:

```bash
cd frontend
npm install
npm start
```

Acesse:

```text
http://localhost:4200
```

O Docker fica responsavel apenas pelo banco PostgreSQL em `localhost:5432`.

Para parar o banco:

```bash
docker compose down
```

Para conferir o backend diretamente:

```text
http://localhost:3000
http://localhost:3000/api/produtos
```

O arquivo `frontend/proxy.conf.json` encaminha as chamadas `/api` para o backend em `http://localhost:3000`.

## Como testar

```bash
node --test tests/*.test.js
```

## Arquitetura

```text
src/
  domain/          Status e erros de dominio
  repositories/    Acesso a dados em memoria
  services/        Regras de negocio e casos de uso
  controllers/     Entrada das requisicoes HTTP
  http/            Servidor, roteamento e helpers REST

frontend/
  src/app/         Componentes, modelos e servico HTTP do Angular

docker/
  postgres/        Script SQL inicial do PostgreSQL
```
