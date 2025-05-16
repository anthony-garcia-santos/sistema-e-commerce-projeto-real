# Sistema de Autenticação e Gestão de Produtos 🔒
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![License](https://img.shields.io/badge/license-Pessoal-red)
![Stack](https://img.shields.io/badge/stack-Node.js%20%2B%20React-blue)

Um sistema full-stack completo com:
✔ Autenticação segura via JWT (cookies HTTP-only)
✔ Controle de acesso por níveis (usuário/admin)
✔ CRUD de produtos (apenas para administradores)
✔ UI moderna e responsiva com TailwindCSS

## 📌 Índice
1. [Objetivo Comercial](#objetivo-comercial)
2. [Funcionalidades](#funcionalidades)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Fluxo de Autenticação](#fluxo-de-autenticação)
6. [Roadmap](#roadmap)
7. [Licença](#licença)


## 🎯 Objetivo Comercial
Sistema desenvolvido para **automatizar e otimizar processos de vendas**, resolvendo problemas críticos de gestão.

### 🚀 Benefícios para Negócios
- **Automação de Vendas**
  - Cadastro inteligente de produtos
  - Controle de estoque integrado
  - Processos reduzidos em até 40%

- **Gestão de Tráfego Qualificado**
  - Painel administrativo para análise de conversões
  - Segmentação de usuários por comportamento
  - Integração futura com Google Analytics/Meta Pixel

- **Segurança Transacional**
  - Autenticação robusta para equipes comerciais
  - Dados protegidos por criptografia JWT

## ✨ Funcionalidades

### Frontend (React)
- **Autenticação segura**
  - Login com validação de dados
  - Cadastro de novos usuários
  - Logout com remoção de cookies
- **Controle de acesso**
  - Rotas protegidas por perfil (usuário/admin)
  - Redirecionamento automático baseado em role
- **Gestão de produtos**
  - Criação de produtos (apenas admin)
  - Listagem dinâmica de produtos
- **UI moderna**
  - Design responsivo (mobile-first)
  - Feedback visual em ações

### Backend (Node.js/Express)
- **Segurança reforçada**
  - Autenticação JWT com cookies HTTP-only
  - Rate limiting (5 tentativas de login/15min)
  - Validação de dados com express-validator
- **Banco de dados**
  - MongoDB com Mongoose
  - Schemas para Usuários e Produtos
- **API RESTful**
  - Endpoints bem definidos
  - Tratamento de erros detalhado

## 🛠 Tecnologias Utilizadas

| **Frontend**       | **Backend**         | **Banco de Dados** |
|--------------------|--------------------|--------------------|
| React 18           | Node.js            | MongoDB            |
| Vite               | Express            | Mongoose           |
| React Router 6     | JWT                |                    |
| Axios              | BcryptJS           |                    |
| TailwindCSS        | Express Validator  |                    |

## 📂 Estrutura do Projeto

📦 Lolo_Personalizado
├── 📂 frontend
│   ├── 📂 public
│   └── 📂 src
│       ├── 📂 components
│       ├── 📂 pages
│       ├── 📂 routes
│       ├── 📂 services
│       └── App.jsx
└── 📂 backend
    ├── 📂 src
    │   ├── 📂 controllers
    │   ├── 📂 models
    │   ├── 📂 routes
    │   ├── 📂 validator
    │   └── server.js
    └── .env



## 🔐 Fluxo de Autenticação
1. Usuário faz login/cadastro
2. Servidor valida dados e gera JWT
   - Armazenado em cookie HTTP-only seguro
3. Frontend redireciona conforme perfil
   - Admin → Painel administrativo
   - Usuário → Página inicial
4. Todas requisições subsequentes
   - Incluem cookie automaticamente
5. Middleware verifica token
   - Rotas protegidas exigem autenticação válida

## 🔮 Roadmap (Próximas Features)
- [ ] Integrar APIs de pagamento (ex: Stripe, MercadoPago)
- [ ] Criar dashboard de métricas de vendas (gráficos em tempo real)
- [ ] Implementar sistema de cupons e promoções
- [ ] Realizar deploy com hospedagem e domínio personalizados

      
## 📝 Licença

© 2025 Anthony Garcia Santos — **Todos os direitos reservados**

Este projeto é disponibilizado **exclusivamente para fins de portfólio pessoal**.

### ✔ Permissões
- Visualização e análise do código
- Inspiração para projetos educacionais ou portfólios pessoais

### ❌ Restrições
- É **proibida** a cópia, modificação ou redistribuição
- **Uso comercial ou em produção não autorizado**

📧 Para solicitações de uso especial ou parcerias:  
**Anthony.garcia.santos17@gmail.com**


---

**Desenvolvido por [Anthony Garcia Santos]**  
🔗 [LinkedIn](https://www.linkedin.com/in/anthony-santos-17820b358/)  

> "Código seguro, eficiente e feito para resolver sérios problemas de negócios!" 💼🚀


