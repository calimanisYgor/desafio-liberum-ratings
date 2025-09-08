# Desafio Liberum Ratings

Este projeto é uma aplicação full-stack desenvolvida como parte do desafio Liberum Ratings, composta por um backend em Node.js e um frontend em React.

## Visão Geral do Projeto

O objetivo deste projeto é simular um sistema de e-commerce básico, onde usuários podem visualizar produtos, fazer pedidos e administradores podem gerenciar produtos e pedidos.

## Tecnologias Utilizadas

### Backend

-   **Node.js**: Ambiente de execução JavaScript.
-   **Express**: Framework web para Node.js.
-   **TypeScript**: Linguagem de programação para tipagem estática.
-   **TypeORM**: ORM para Node.js, compatível com TypeScript.
-   **PostgreSQL**: Banco de dados relacional.
-   **bcryptjs**: Para hash de senhas.
-   **jsonwebtoken**: Para autenticação baseada em JWT.
-   **Zod**: Para validação de esquemas.
-   **dotenv**: Para gerenciamento de variáveis de ambiente.
-   **cors**: Para habilitar o CORS.

### Frontend

-   **React**: Biblioteca JavaScript para construção de interfaces de usuário.
-   **Vite**: Ferramenta de build para projetos frontend.
-   **TypeScript**: Linguagem de programação para tipagem estática.
-   **Axios**: Cliente HTTP para fazer requisições à API.
-   **Zustand**: Gerenciador de estado leve.
-   **React Router DOM**: Para roteamento na aplicação.
-   **Tailwind CSS**: Framework CSS utilitário para estilização.
-   **Shadcn UI**: Componentes de UI construídos com Tailwind CSS e Radix UI.
-   **React Hook Form**: Para gerenciamento de formulários.
-   **Zod**: Para validação de esquemas de formulário.
-   **React Query**: Para gerenciamento de dados assíncronos.

## Configuração e Execução

Certifique-se de ter o Node.js (versão 18 ou superior) e o Docker instalados em sua máquina.

### 1. Configuração do Backend

1.  Navegue até o diretório `backend`:
    ```bash
    cd backend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Crie um arquivo `.env` na raiz do diretório `backend` e configure as variáveis de ambiente. Você pode usar o `.env.example` como base:
    ```
    API_PORT=3333

    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=docker
    DB_PASSWORD=docker
    DB_NAME=liberum_ratings

    JWT_ACCESS_SECRET=seu_segredo_jwt_access
    JWT_REFRESH_SECRET=seu_segredo_jwt_refresh
    ```
    **Importante**: Substitua `seu_segredo_jwt_access` e `seu_segredo_jwt_refresh` por strings aleatórias e seguras.

4.  Inicie o contêiner do PostgreSQL usando Docker Compose:
    ```bash
    docker-compose up -d
    ```

5.  Execute as migrações do banco de dados para criar as tabelas:
    ```bash
    npm run migration:run
    ```

6.  Execute o script de seed para popular o banco de dados com um usuário administrador e alguns produtos:
    ```bash
    npm run seed
    ```

7.  Inicie o servidor backend:
    ```bash
    npm run dev
    ```
    O servidor estará rodando em `http://localhost:3333`.

### 2. Configuração do Frontend

1.  Abra um novo terminal e navegue até o diretório `frontend`:
    ```bash
    cd frontend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Inicie a aplicação frontend:
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:5173` (ou outra porta disponível).

## Usuário Seed

Após executar o comando `npm run seed` no backend, um usuário administrador será criado com as seguintes credenciais:

-   **Email**: `admin@example.com`
-   **Senha**: `admin123`

## Endpoints da API (Backend)

Todos os endpoints são prefixados por `http://localhost:3333`.

### Autenticação (`/auth`)

-   `POST /auth/register`: Registra um novo usuário (requer ADMIN).
-   `POST /auth/login`: Realiza o login do usuário e retorna tokens de acesso e refresh.
-   `POST /auth/refresh`: (Interno) Utilizado para renovar o token de acesso com o token de refresh.

### Produtos (`/products`)

-   `GET /products`: Lista todos os produtos.
-   `GET /products/:id`: Retorna um produto específico pelo ID.
-   `POST /products`: Cria um novo produto (requer ADMIN).
-   `PATCH /products/:id`: Atualiza um produto existente (requer ADMIN).
-   `DELETE /products/:id`: Exclui um produto (requer ADMIN).

### Pedidos (`/orders`)

-   `POST /orders`: Cria um novo pedido.
-   `GET /orders`: Lista todos os pedidos (usuários veem seus próprios pedidos; ADMINs veem todos).
-   `PATCH /orders/:id/status`: Atualiza o status de um pedido (requer ADMIN).

## Decisões Arquiteturais

### Backend

-   **Estrutura Modular**: O backend é organizado em módulos (auth, products, orders) para melhor separação de responsabilidades e manutenibilidade.
-   **TypeORM**: Escolhido para abstração do banco de dados e facilidade no gerenciamento de entidades e migrações.
-   **JWT para Autenticação**: Padrão seguro e amplamente utilizado para autenticação stateless.
-   **Zod para Validação**: Garante a validação robusta dos dados de entrada, tanto para requisições quanto para esquemas de banco de dados.
-   **Middlewares**: Utilização de middlewares para autenticação (`authMiddleware`) e tratamento centralizado de erros (`errorMiddleware`).

### Frontend

-   **Componentização com React**: Interface de usuário construída com componentes reutilizáveis para modularidade e escalabilidade.
-   **Zustand para Gerenciamento de Estado**: Escolhido por sua simplicidade e leveza para gerenciar o estado global da aplicação (ex: autenticação, carrinho).
-   **React Query para Dados Assíncronos**: Facilita o caching, sincronização e atualização de dados do servidor, melhorando a experiência do usuário e a performance.
-   **Tailwind CSS e Shadcn UI**: Proporcionam um desenvolvimento rápido e consistente da UI, com componentes acessíveis e personalizáveis.
-   **Axios Interceptors**: Implementação de interceptors para lidar globalmente com requisições (ex: adicionar token de autenticação) e respostas (ex: refresh de token, tratamento de erros).
-   **Roteamento Protegido**: Utilização de `react-router-dom` com rotas protegidas para garantir que apenas usuários autenticados e com as permissões corretas acessem determinadas páginas.

# Melhorias a serem implementadas com mais tempo

Com mais tempo disponível, as seguintes melhorias poderiam ser implementadas para tornar o sistema mais robusto, escalável e amigável ao usuário:

## Funcionalidades Principais

1.  **Gerenciamento de Usuários e Perfis:**
    *   **Perfis de Usuário:** Permitir que usuários visualizem e editem suas informações de perfil (nome, email, senha).
    *   **Recuperação de Senha:** Implementar fluxo de "Esqueceu a senha?" com envio de email.
    *   **Mais Papéis de Usuário:** Além de `ADMIN`, considerar papéis como `MANAGER` ou `CUSTOMER` com permissões mais granulares.

2.  **Gerenciamento de Produtos:**
    *   **Categorias/Tags de Produtos:** Adicionar funcionalidade para categorizar produtos, facilitando a navegação e busca.
    *   **Imagens de Produtos:** Suporte para upload e exibição de múltiplas imagens por produto.
    *   **Busca e Filtragem Avançada:** Implementar busca por texto, filtragem por preço, categoria, etc., tanto no frontend quanto no backend.

3.  **Gerenciamento de Pedidos:**
    *   **Histórico de Pedidos Detalhado:** Usuários poderiam ver um histórico completo de seus pedidos, incluindo itens, status e datas.
    *   **Mais Status de Pedido:** Expandir os status de pedido (ex: `Pendente`, `Processando`, `Enviado`, `Entregue`, `Cancelado`).
    *   **Dashboard de Admin para Pedidos:** Uma interface mais rica para administradores gerenciarem e acompanharem o fluxo de pedidos.

4.  **Carrinho de Compras:**
    *   **Persistência do Carrinho:** Salvar o carrinho de compras (no banco de dados para usuários logados ou no `localStorage` para convidados).
    *   **Ajuste de Quantidade:** Permitir que o usuário ajuste a quantidade de itens diretamente no carrinho.

5.  **Integração de Pagamento:**
    *   Integrar com um gateway de pagamento real (ex: Stripe, PayPal, PagSeguro) para processar transações.

## Melhorias Técnicas e de Infraestrutura

1.  **Testes Abrangentes:**
    *   **Testes Unitários:** Cobrir a lógica de negócios crítica no backend e componentes/funções no frontend.
    *   **Testes de Integração:** Validar a interação entre diferentes módulos e com o banco de dados.
    *   **Testes E2E (End-to-End):** Utilizar ferramentas como Cypress ou Playwright para simular fluxos de usuário completos.

2.  **CI/CD (Integração Contínua/Entrega Contínua):**
    *   Configurar pipelines de CI/CD (ex: GitHub Actions, GitLab CI) para automatizar testes, builds e deployments.

3.  **Monitoramento e Logging:**
    *   Implementar ferramentas de monitoramento (ex: Prometheus, Grafana) e logging centralizado (ex: ELK Stack) para acompanhar a saúde da aplicação e depurar problemas em produção.

4.  **Otimização de Performance:**
    *   **Caching:** Utilizar um sistema de cache (ex: Redis) para dados frequentemente acessados, reduzindo a carga no banco de dados.
    *   **Otimização de Consultas:** Revisar e otimizar consultas SQL e índices de banco de dados.

## Melhorias de UI/UX

1.  **Responsividade Aprimorada:** Garantir que a aplicação seja totalmente responsiva e ofereça uma ótima experiência em todos os dispositivos (desktop, tablet, mobile).
2.  **Estados de Carregamento e Feedback:**
    *   **Skeletons/Loaders:** Exibir estados de carregamento visuais para operações assíncronas.
3.  **Dashboard de Usuário:** Uma página inicial personalizada para usuários logados, mostrando informações relevantes (ex: últimos pedidos, produtos favoritos).
4. **Dashboard de Admin** Uma página personalizada para admins, mostrando informações sobre qual produto vendeu mais, informações de estoque de forma rápida e direta, qual cliente comprou mais.
