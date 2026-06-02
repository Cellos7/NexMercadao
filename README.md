# NexLog Mercadao

Projeto MVP da atividade de Imersao Profissional.

Caso de uso implementado: **UC03 - Realizar Pedido**.

## O que tem

- Backend Node.js com API REST
- Frontend Angular
- PostgreSQL via Docker
- Testes do caso de uso

## Funcionalidades

- Listar produtos
- Criar pedido
- Simular pagamento
- Baixar estoque depois do pagamento
- Listar pedidos

## Rodar o projeto

Subir o banco:

```bash
docker compose up -d
```

Backend:

```powershell
$env:DATABASE_URL="postgres://nexlog:nexlog123@localhost:5432/nexlog_mercadao"
npm install
npm start
```

Frontend:

```bash
cd frontend
npm install
npm start
```

Acessar:

```text
http://localhost:4200
```

## Rotas

```text
GET  /api/produtos
POST /api/pedidos
POST /api/pedidos/:id/pagar
GET  /api/pedidos
```

## Testes

```bash
npm test
```

## Documentos

- [Definicao do Projeto](docs/definicao-projeto.pdf)
- [Documento de Requisitos](docs/documento-requisitos.pdf)
- [Documento de Casos de Uso](docs/documento-casos-de-uso.pdf)
- [Diagrama de Casos de Uso](docs/diagrama-casos-de-uso.pdf)
- [Diagrama de Classes](docs/diagrama-classes.pdf)
- [DER](docs/diagrama-der.pdf)
- [Resumo Jira](docs/resumo-jira.pdf)

## Pastas principais

```text
src/        backend
frontend/   Angular
tests/      testes do UC03
docker/     script inicial do banco
docs/       documentos da entrega
```
