# 🥗 Rangoo - Delivery de Alimentos Saudáveis

![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white) ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Insomnia](https://img.shields.io/badge/Insomnia-black?style=for-the-badge&logo=insomnia&logoColor=5849BE) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) ![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white) ![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

### 📊 Modelo de Negócio
O **Rangoo** é uma API focada no nicho de alimentação saudável. A plataforma permite a conexão direta entre o estoque de produtos nutritivos e o consumidor final, facilitando a escolha de refeições baseadas em dietas específicas.

### 📝 Descrição Geral
API REST desenvolvida para gerenciar um sistema de delivery saudável. A aplicação permite o controle de usuários, a organização de cardápios por categorias e a gestão de produtos, garantindo que o fluxo de dados seja seguro, documentado e pronto para escala em nuvem.

---

### 🗄️ Entidades e Atributos

#### 1. Usuário (`tb_usuarios`)
* **id:** Long
* **nome:** String
* **usuario:** String (E-mail)
* **senha:** String (Criptografada com BCrypt)
* **foto:** String
* **tipo:** String

#### 2. Categoria (`tb_categorias`)
* **id:** Long
* **descricao:** String

#### 3. Produto (`tb_produtos`)
* **id:** Long
* **nome:** String
* **descricao:** String
* **preco:** Decimal
* **foto:** String

---

### ✨ Funcionalidade Especial
> **Listagem Saudável:** Filtro customizado para listar alimentos em ordem de "mais saudáveis", priorizando a exibição de itens conforme os critérios nutricionais do cardápio.

---

### ⚙️ Funcionalidades Principais
* **Autenticação JWT:** Login seguro com geração de tokens para proteção das rotas de cadastro e edição.
* **CORS Habilitado:** API configurada para aceitar requisições de diferentes origens (Front-end).
* **Ambiente de Produção:** Deploy automatizado e banco de dados hospedado em nuvem.
* **Documentação:** Interface Swagger completa para testes e consulta de endpoints.

---

### 🛠️ CRUD COMPLETO DAS TABELAS:
* **Usuários** (Cadastro, Login, Busca por ID, Atualização e Exclusão)
* **Categorias** (Criação, Consulta, Atualização e Exclusão)
* **Produtos** (Criação, Consulta, Listagem dos mais saudáveis, Atualização e Exclusão)

---

### 💻 Tecnologias Utilizadas
* **Linguagem:** TypeScript
* **Framework:** NestJS
* **Banco de Dados Local:** MySQL
* **Banco de Dados Cloud:** PostgreSQL (Render)
* **Testes de API:** Insomnia
* **Documentação:** Swagger UI
* **Hospedagem:** Render
