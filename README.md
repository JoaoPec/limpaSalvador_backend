# LimpaSalvador Backend

## Deploy do projeto:

- [LimpaSalvador](https://limpa-salvador-frontend.vercel.app/)

## Repositório do Frontend:

- [LimpaSalvador Frontend](https://github.com/JoaoPec/limpaSalvador_Frontend)

## Visão Geral

O backend do projeto LimpaSalvador é construído utilizando Node.js e Express. Ele oferece serviços de autenticação, gerenciamento de usuários, criação e obtenção de posts, além do upload de imagens utilizando o Cloudinary.

## Configuração do Projeto

### Dependências

Para instalar as dependências do projeto, execute:

```bash
npm install
```

Variáveis de Ambiente

Crie um arquivo .env na raiz do projeto com as seguintes variáveis de ambiente:

```bash

DATABASE_URL=postgres://user:password@localhost:5432/limpasalvador
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

## Iniciar o Servidor

Para iniciar o servidor, execute:

```bash
node app.js
```
## Estrutura do Projeto

### Roteamento

/api/auth

    GET /login: Exibe a página de login.
    POST /login: Autentica um usuário com email e senha, retorna um token JWT.
    POST /register: Registra um novo usuário com nome, email, telefone e senha.
    GET /checkAuth: Verifica se o token JWT é válido e retorna o status de autenticação.

/api/user

    POST /post: Cria um novo post com título, conteúdo, bairro e imagem (requer autenticação).
    GET /posts: Obtém todos os posts.

Funcionalidades Adicionais
Upload de Imagens

    As imagens são carregadas no Cloudinary e a URL segura da imagem é retornada e armazenada no banco de dados.

Tecnologias Utilizadas

    Node.js: Ambiente de execução para JavaScript no servidor.
    Express: Framework para construção de aplicações web.
    PostgreSQL: Banco de dados relacional.
    JWT: Utilizado para autenticação segura.
    Cloudinary: Serviço para upload e gerenciamento de imagens.
    Multer: Middleware para upload de arquivos.


## Hospedagem

A api está hospedada no Render, assim como o banco de dados PostgreSQL.

## Desenvolvimento e Contribuição

Clonando o Repositório

Para clonar o repositório, execute:

```bash
git clone https://github.com/JoaoPec/limpaSalvador_backend
```

Sinta-se à vontade para abrir issues e enviar pull requests. A contribuição de todos é bem-vinda!
