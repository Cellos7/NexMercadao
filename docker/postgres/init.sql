CREATE TABLE IF NOT EXISTS produtos (
  id VARCHAR(30) PRIMARY KEY,
  fornecedor_id VARCHAR(30) NOT NULL,
  nome_fornecedor VARCHAR(120) NOT NULL,
  nome VARCHAR(120) NOT NULL,
  preco NUMERIC(10, 2) NOT NULL,
  estoque INTEGER NOT NULL,
  perecivel BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS pedidos (
  id VARCHAR(30) PRIMARY KEY,
  comprador_id VARCHAR(30) NOT NULL,
  fornecedor_id VARCHAR(30) NOT NULL,
  endereco_entrega VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  criado_em TIMESTAMP NOT NULL,
  pago_em TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS itens_pedido (
  id SERIAL PRIMARY KEY,
  pedido_id VARCHAR(30) NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id VARCHAR(30) NOT NULL REFERENCES produtos(id),
  nome_produto VARCHAR(120) NOT NULL,
  quantidade INTEGER NOT NULL,
  preco_unitario NUMERIC(10, 2) NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS pagamentos (
  id VARCHAR(30) PRIMARY KEY,
  pedido_id VARCHAR(30) NOT NULL REFERENCES pedidos(id),
  status VARCHAR(20) NOT NULL,
  valor NUMERIC(10, 2) NOT NULL,
  pago_em TIMESTAMP NOT NULL
);

INSERT INTO produtos (id, fornecedor_id, nome_fornecedor, nome, preco, estoque, perecivel)
VALUES
  ('prod-001', 'forn-001', 'Distribuidora Sol', 'Arroz Tipo 1 5kg', 24.90, 35, FALSE),
  ('prod-002', 'forn-001', 'Distribuidora Sol', 'Feijao Carioca 1kg', 8.49, 50, FALSE),
  ('prod-003', 'forn-002', 'Frios Norte', 'Iogurte Natural 900g', 12.70, 18, TRUE)
ON CONFLICT (id) DO NOTHING;
