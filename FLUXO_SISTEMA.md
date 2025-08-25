# Fluxo do Sistema Jurify

Este documento descreve o fluxo do sistema Jurify, explicando a função de cada arquivo e pasta, bem como suas interdependências.

## Visão Geral da Arquitetura

O sistema Jurify é uma aplicação web completa dividida em duas partes principais:

1. **Backend**: API RESTful desenvolvida com Node.js, Express e Prisma ORM
2. **Frontend**: Interface de usuário desenvolvida com React, React Router e Axios

## Estrutura do Backend

### Pastas Principais

- **prisma/**: Contém configurações do ORM Prisma para interação com o banco de dados
- **src/**: Contém o código-fonte da aplicação backend
  - **controllers/**: Controladores que processam as requisições e retornam respostas
  - **middlewares/**: Funções intermediárias para processamento de requisições
  - **prisma/**: Cliente Prisma para acesso ao banco de dados
  - **routes/**: Definição das rotas da API
  - **types/**: Definições de tipos TypeScript
  - **utils/**: Funções utilitárias

### Arquivos Principais

- **prisma/schema.prisma**: Define a estrutura do banco de dados e os modelos (User, Processo, Decisao, Crime)
- **src/app.ts**: Configura a aplicação Express, middlewares e rotas
- **src/server.ts**: Inicializa o servidor HTTP e WebSockets
- **src/prisma/client.ts**: Exporta uma instância do cliente Prisma para uso em toda a aplicação

### Controladores

- **src/controllers/authController.ts**: Gerencia autenticação de usuários (registro e login)
- **src/controllers/userController.ts**: Gerencia operações relacionadas a usuários
- **src/controllers/processoController.ts**: Gerencia operações CRUD para processos judiciais
- **src/controllers/decisaoController.ts**: Gerencia operações CRUD para decisões judiciais
- **src/controllers/crimeController.ts**: Gerencia operações CRUD para registros criminais
- **src/controllers/consultaProcessualController.ts**: Gerencia consultas processuais através de API externa

### Fluxo de Dados no Backend

1. **Entrada de Requisição**: As requisições HTTP chegam ao servidor através do arquivo `server.ts`
2. **Roteamento**: O arquivo `app.ts` direciona as requisições para as rotas apropriadas
3. **Middleware de Autenticação**: Requisições protegidas passam pelo middleware `authMiddleware.ts`
4. **Controladores**: As rotas chamam funções nos controladores que processam a lógica de negócio
5. **Acesso ao Banco de Dados**: Os controladores utilizam o cliente Prisma para interagir com o banco de dados
6. **Resposta**: Os controladores retornam respostas HTTP para o cliente

### Modelos de Dados

- **User**: Representa um usuário do sistema com autenticação
- **Processo**: Representa um processo judicial associado a um usuário
- **Decisao**: Representa uma decisão judicial associada a um processo
- **Crime**: Representa um registro criminal associado a um processo

## Estrutura do Frontend

### Pastas Principais

- **src/**: Contém o código-fonte da aplicação frontend
  - **components/**: Componentes React reutilizáveis
  - **hooks/**: Hooks personalizados do React
  - **layouts/**: Componentes de layout da aplicação
  - **pages/**: Componentes de página da aplicação
  - **services/**: Serviços para comunicação com a API
  - **types/**: Definições de tipos TypeScript
  - **utils/**: Funções utilitárias

### Arquivos Principais

- **src/main.tsx**: Ponto de entrada da aplicação React
- **src/App.tsx**: Componente principal que configura o roteamento
- **src/routes.tsx**: Define as rotas da aplicação
- **src/hooks/useAuth.ts**: Hook para gerenciamento de autenticação
- **src/services/api.ts**: Configuração do cliente Axios para comunicação com a API

### Páginas

- **src/pages/HomePage.tsx**: Página inicial que exibe os módulos disponíveis ou tela de boas-vindas
- **src/pages/LoginPage.tsx**: Página de login para autenticação de usuários
- **src/pages/RegisterPage.tsx**: Página de registro para criação de novas contas
- **src/pages/ProcessualPage.tsx**: Página para consulta e análise de processos judiciais
- **src/pages/JurimetriaPage.tsx**: Página para análise estatística de dados jurídicos
- **src/pages/JurisprudenciaPage.tsx**: Página para pesquisa de decisões e precedentes judiciais
- **src/pages/CriminalPage.tsx**: Página para análise de dados criminais e estatísticas

### Fluxo de Dados no Frontend

1. **Inicialização**: A aplicação é inicializada através do arquivo `main.tsx`
2. **Roteamento**: O componente `App.tsx` configura o roteamento com React Router
3. **Autenticação**: O hook `useAuth.ts` gerencia o estado de autenticação do usuário
4. **Proteção de Rotas**: O componente `ProtectedRoute.tsx` protege rotas que requerem autenticação
5. **Layouts**: Os componentes em `layouts/` fornecem estruturas de página consistentes
6. **Páginas**: Os componentes em `pages/` representam as diferentes telas da aplicação
7. **Comunicação com API**: O serviço `api.ts` gerencia as requisições HTTP para o backend

## Fluxo de Autenticação

1. **Login/Registro**: 
   - Usuário acessa a página de login (`LoginPage.tsx`) ou registro (`RegisterPage.tsx`)
   - Preenche o formulário com suas credenciais
   - Submete o formulário, que chama a função `login()` ou `register()` do hook `useAuth.ts`

2. **Requisição ao Backend**:
   - O hook `useAuth.ts` faz uma requisição POST para `/auth/login` ou `/auth/register` usando o serviço `api.ts`
   - O interceptor de requisição em `api.ts` adiciona cabeçalhos necessários

3. **Processamento no Backend**:
   - A requisição é roteada para o controlador `authController.ts`
   - O controlador valida as credenciais (usando bcrypt para verificar senhas)
   - Se válido, gera um token JWT usando a chave secreta definida em `jwt.ts`

4. **Resposta e Armazenamento**:
   - O backend retorna o token JWT e informações do usuário
   - O hook `useAuth.ts` armazena o token no localStorage
   - O estado `isAuthenticated` é atualizado para `true`

5. **Navegação Protegida**:
   - O usuário é redirecionado para a página inicial
   - Rotas protegidas são envolvidas pelo componente `ProtectedRoute.tsx`
   - Este componente verifica o estado `isAuthenticated` e redireciona para login se necessário

6. **Requisições Autenticadas**:
   - O interceptor em `api.ts` adiciona o token JWT ao cabeçalho `Authorization` de todas as requisições
   - No backend, o middleware `authenticateJWT` em `authMiddleware.ts` verifica o token
   - Se válido, adiciona o ID do usuário à requisição para uso nos controladores

## Fluxo de Processos Judiciais

1. **Criação de Processo**:
   - Usuário acessa a interface de criação de processo
   - Preenche os dados do processo (número, descrição, status)
   - Submete o formulário, que faz uma requisição POST para `/processos`
   - O controlador `processoController.ts` cria o registro no banco de dados via Prisma
   - O processo é associado ao usuário autenticado através do ID extraído do token JWT

2. **Consulta Processual**:
   - Usuário acessa a página `ProcessualPage.tsx`
   - Seleciona o tipo de consulta (CPF, CNPJ ou número do processo)
   - Insere o valor a ser consultado
   - A função `consultarProcessoPorFiltro()` em `api.ts` faz uma requisição POST para `/consulta-processual/consulta`
   - O controlador `consultaProcessualController.ts` valida os dados e consulta a API externa da Predictus
   - Os resultados são retornados e exibidos na interface

3. **Gerenciamento de Decisões Judiciais**:
   - Usuário pode adicionar decisões judiciais a um processo existente
   - Os dados são enviados para o controlador `decisaoController.ts`
   - O controlador cria, atualiza ou exclui registros de decisão no banco de dados
   - As decisões são associadas ao processo através do campo `processoId`

4. **Gerenciamento de Registros Criminais**:
   - Usuário pode adicionar registros criminais relacionados a um processo
   - Os dados são enviados para o controlador `crimeController.ts`
   - O controlador gerencia os registros de crimes no banco de dados
   - Os crimes podem ser associados a processos específicos

## Interdependências de Arquivos

### Backend

- **server.ts** depende de **app.ts**
- **app.ts** depende dos arquivos em **routes/**
- Os arquivos em **routes/** dependem dos arquivos em **controllers/** e **middlewares/**
- Os arquivos em **controllers/** dependem de **prisma/client.ts**
- **prisma/client.ts** depende de **prisma/schema.prisma**

### Frontend

- **main.tsx** depende de **App.tsx**
- **App.tsx** depende de **routes.tsx**
- **routes.tsx** depende dos arquivos em **pages/**, **layouts/**, e **components/**
- Os arquivos em **pages/** dependem de **hooks/useAuth.ts** e **services/api.ts**
- **components/ProtectedRoute.tsx** depende de **hooks/useAuth.ts**
- **services/api.ts** configura a comunicação com o backend

## Fluxo de Execução

1. O backend é iniciado através do comando `npm run dev` na pasta backend
2. O frontend é iniciado através do comando `npm run dev` na pasta frontend
3. O usuário acessa a aplicação através do navegador no endereço `http://localhost:3000`
4. O usuário interage com a interface, que se comunica com o backend através de requisições HTTP
5. O backend processa as requisições, interage com o banco de dados e retorna respostas para o frontend

## Integração com APIs Externas

1. **API Predictus**:
   - Utilizada para consulta de processos judiciais
   - Integração gerenciada pelo controlador `consultaProcessualController.ts`
   - Requer autenticação com credenciais específicas
   - Permite consultas por CPF, CNPJ ou número de processo
   - Retorna dados detalhados sobre processos judiciais

## Fluxo de Dados Completo

1. **Usuário acessa a aplicação**:
   - Carrega o frontend através do navegador
   - React Router direciona para a rota apropriada

2. **Autenticação**:
   - Usuário se autentica através do fluxo descrito anteriormente
   - Token JWT é armazenado e utilizado em requisições subsequentes

3. **Navegação na aplicação**:
   - Usuário navega entre os diferentes módulos (Processual, Jurimetria, Jurisprudência, Criminal)
   - Componentes React renderizam as interfaces apropriadas

4. **Interação com dados**:
   - Usuário realiza operações CRUD em processos, decisões e crimes
   - Frontend envia requisições HTTP para o backend
   - Backend processa as requisições, interage com o banco de dados e retorna respostas

5. **Consultas externas**:
   - Usuário realiza consultas processuais
   - Backend consulta a API externa da Predictus
   - Resultados são processados e retornados para o frontend

## Conclusão

O sistema Jurify segue uma arquitetura cliente-servidor moderna, com separação clara entre frontend e backend. O backend fornece uma API RESTful que o frontend consome para fornecer uma interface de usuário interativa. A autenticação é gerenciada através de tokens JWT, e o acesso ao banco de dados é abstraído pelo Prisma ORM.

O sistema integra-se com APIs externas para fornecer funcionalidades avançadas de consulta processual, e sua arquitetura modular permite fácil manutenção e extensão. A separação de responsabilidades entre os diferentes componentes do sistema facilita o desenvolvimento colaborativo e a escalabilidade.