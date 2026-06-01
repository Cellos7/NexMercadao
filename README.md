# Definição do Projeto — NexLog Mercadão

## 1. Visão Geral
O NexLog Mercadão é uma plataforma marketplace para o setor FMCG 
(Bens de Consumo de Movimento Rápido). Faz a conexão entre fornecedores 
e compradores, permitindo o cadastro de produtos tendo controle de 
estoque em tempo real, faz também pagamento de pedidos e o 
acompanhamento da entrega em tempo real.

## 2. Objetivo Geral
Objetivo é a entrega de uma plataforma que facilita a mediação entre 
fornecedor e compradores da área, fazendo a gestão de estoque, 
pedidos, pagamento e a logística da entrega.

## 3. Justificativa
O setor FMCG tem uma alta rotatividade de mercadorias. Pequenos 
varejistas tendem a ter problemas em encontrar fornecedores com 
disponibilidade momentânea, e os fornecedores têm dificuldade de 
medir a demanda em tempo real. O NexLog Mercadão vem com o intuito 
de resolver esses problemas.

## 4. Público-Alvo e Atores
Público sendo fornecedores e compradores varejistas do setor FMCG, 
entregadores e administradores que gerenciam a plataforma.

## 5. Escopo
O escopo será o cadastro e autenticação dos 4 usuários citados, 
gestão de produtos, veículos e rotas, realização de pedidos e 
pagamentos, despacho com vinculação de entregador, veículo e rota 
e atualização de estoque e rastreamento de entrega em tempo real.

## 6. Tecnologias
- Backend: Node.js, Express, Prisma
- Banco de dados: PostgreSQL
- Comunicação em tempo real: Socket.IO
- Autenticação: JWT
- Frontend: Angular
- Mapa e geolocalização: Leaflet + OpenStreetMap
- Containerização: Docker
- Controle de versão: Git/GitHub
- Gerenciamento de tarefas: Jira

## 7. Premissas e Restrições

**Premissas:**
- Usuários têm acesso à internet estável
- Compradores são pessoas jurídicas (varejistas)
- Operação restrita a uma única região no MVP

**Restrições:**
- Sistema 100% web (sem app mobile nativo)
- Pagamento simulado (sem integração real com gateway)
- Cálculo de frete simplificado (fórmula direta, sem cálculo de rota por ruas)
- Posição do entregador será simulada (sem GPS real do dispositivo)
- Cada pedido envolve um único fornecedor
- Idioma: PT-BR



# Requisitos e Regras de Negócio — NexLog Mercadão

## Requisitos Funcionais

**Autenticação**
- RF01: Cadastro de usuário escolhendo entre fornecedor, comprador 
  ou entregador
- RF02: Login com e-mail e senha, retornando token JWT

**Fornecedor**
- RF03: Cadastrar e editar produtos (nome, preço, estoque, perecível 
  ou não)
- RF04: Visualizar pedidos recebidos e seus status

**Comprador**
- RF05: Vitrine de produtos com estoque atualizado em tempo real
- RF06: Fazer pedido informando produtos, quantidades e endereço de 
  entrega
- RF07: Pagar o pedido em fluxo simulado
- RF08: Acompanhar a entrega no mapa em tempo real
- RF09: Consultar histórico de pedidos

**Entregador**
- RF10: Visualizar entregas atribuídas
- RF11: Atualizar status da entrega (em rota, entregue, falha)

**Administrador**
- RF12: Cadastrar veículos (placa, modelo, capacidade, se é refrigerado)
- RF13: Cadastrar rotas (nome e região atendida)
- RF14: Despachar pedidos pagos vinculando entregador, veículo e rota

**Tempo real**
- RF15: Atualizar estoque e localização do entregador via WebSocket

## Requisitos Não-Funcionais

- RNF01: API REST entre front e back
- RNF02: Banco PostgreSQL
- RNF03: WebSocket via Socket.IO para tempo real
- RNF04: Senhas com bcrypt, autenticação por JWT
- RNF05: Interface responsiva (desktop e navegador mobile)
- RNF06: Aplicação rodando em containers Docker
- RNF07: Resposta abaixo de 2s em consultas comuns
- RNF08: Arquitetura em camadas (Controller, Service, Repository)

## Regras de Negócio

- RN01: Só fornecedor cadastra produtos
- RN02: Só administrador cadastra veículos, rotas e despacha pedidos
- RN03: Pedido só é despachado depois do pagamento confirmado
- RN04: Cada pedido tem produtos de apenas um fornecedor
- RN05: Não é possível pedir mais do que o estoque disponível
- RN06: Produto perecível só pode ir em veículo refrigerado
- RN07: Entregador só pode ter uma entrega ativa por vez
- RN08: Estoque é descontado no momento do pagamento
- RN09: Pedido entregue não pode ser editado nem cancelado
- RN10: Comprador pode cancelar pedido apenas antes do status "em rota"


# Casos de Uso — NexLog Mercadão

## UC01 — Autenticar Usuário
**Atores:** Fornecedor, Comprador, Entregador, Administrador
**Pré-condição:** usuário já cadastrado
**Pós-condição:** usuário autenticado com token JWT válido

Fluxo principal:
1. Usuário acessa a tela de login
2. Informa e-mail e senha
3. Sistema valida as credenciais
4. Sistema emite token JWT
5. Usuário é redirecionado para a tela inicial conforme seu papel

Fluxos alternativos:
- 3a. Credenciais inválidas → sistema exibe erro e mantém na tela de login

RFs: RF02
RNs: —


## UC02 — Cadastrar Produto
**Ator:** Fornecedor
**Pré-condição:** fornecedor autenticado
**Pós-condição:** produto disponível na vitrine

Fluxo principal:
1. Fornecedor acessa "Meus produtos"
2. Clica em "Novo produto"
3. Preenche nome, preço, estoque e marca se é perecível
4. Confirma o cadastro
5. Sistema valida e salva o produto
6. Sistema notifica a vitrine via WebSocket

Fluxos alternativos:
- 5a. Dados inválidos → sistema exibe erro e mantém o formulário

RFs: RF03, RF15
RNs: RN01


## UC03 — Realizar Pedido
**Ator:** Comprador
**Pré-condição:** comprador autenticado, produtos disponíveis na vitrine
**Pós-condição:** pedido criado e pago, aguardando despacho

Fluxo principal:
1. Comprador acessa a vitrine
2. Seleciona produtos (de um único fornecedor) e quantidades
3. Informa o endereço de entrega
4. Confirma o pedido
5. Sistema valida estoque e fornecedor único
6. Sistema cria o pedido com status "Aguardando pagamento"
7. Comprador efetua o pagamento (fluxo simulado)
8. Sistema confirma o pagamento e decrementa o estoque
9. Pedido passa para status "Aguardando despacho"

Fluxos alternativos:
- 5a. Estoque insuficiente → sistema bloqueia e avisa
- 5b. Produtos de fornecedores diferentes → sistema bloqueia
- 7a. Pagamento falha → pedido continua "Aguardando pagamento"

RFs: RF05, RF06, RF07
RNs: RN04, RN05, RN08


## UC04 — Despachar Pedido
**Ator:** Administrador
**Pré-condição:** pedido com status "Aguardando despacho"
**Pós-condição:** entrega criada, pedido com status "Em rota"

Fluxo principal:
1. Admin acessa lista de pedidos prontos para despacho
2. Seleciona um pedido
3. Escolhe entregador, veículo e rota
4. Confirma o despacho
5. Sistema valida regras (perecível ↔ refrigerado, entregador livre)
6. Sistema cria a entrega e muda o pedido para "Em rota"
7. Sistema notifica o comprador via WebSocket

Fluxos alternativos:
- 5a. Produto perecível + veículo não refrigerado → bloqueia
- 5b. Entregador já com entrega ativa → bloqueia

RFs: RF12, RF13, RF14
RNs: RN02, RN03, RN06, RN07


## UC05 — Rastrear Entrega em Tempo Real
**Ator:** Comprador
**Pré-condição:** pedido despachado (status "Em rota")
**Pós-condição:** comprador acompanhou a entrega até o status final

Fluxo principal:
1. Comprador acessa a tela de rastreamento do pedido
2. Sistema abre conexão WebSocket
3. Sistema envia coordenadas atuais do entregador
4. Mapa exibe o pin do entregador, atualizando conforme chegam coordenadas
5. Quando o entregador conclui, sistema notifica e encerra a conexão

Fluxos alternativos:
- 5a. Entregador marca como "Falha na entrega" → comprador é notificado

RFs: RF08, RF15
RNs: —


## UC06 — Atualizar Status da Entrega
**Ator:** Entregador
**Pré-condição:** entregador com entrega ativa
**Pós-condição:** status da entrega atualizado, comprador notificado

Fluxo principal:
1. Entregador acessa "Minhas entregas"
2. Seleciona a entrega ativa
3. Atualiza o status (em rota → entregue ou falha)
4. Sistema valida e persiste
5. Sistema notifica o comprador via WebSocket

Fluxos alternativos:
- 4a. Transição de status inválida → sistema bloqueia

RFs: RF10, RF11, RF15
RNs: RN09

