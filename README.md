# Aprendendo a consultar tabela de BINs na plataforma ELO

## Iniciando na plataforma de desenvolvedores da (ELO)

1. Se inscreva na plataforma da (elo), você pode entrar com sua conta do Google ou Github [Meus primeiros passos na plataforma de (desenvolvedores) Elo](https://dev.elo.com.br/blog/meus-primeiros-passos-na-plataforma-de-desenvolvedores-elo).

2. Adicione uma aplicação na plataforma, basta colocar o nome da aplicação e a descrição.
3. entrando no painel da sua aplicação e clicando na aba configuração será fornecido o **client_ID**, **secret** e **URI** de homologação necessário para consumo desta API.
4. A API da (elo) foi desenvolvida utilizando o GraphQL, esta tecnologia não utiliza nenhum outro protocolo diferente do HTTP nada disso, porem é um pouco diferente do que estamos acostumados ao manipular os dados com o padrão de APIS REST.
 
## introdução ao GraphQL
 
O GraphQL é uma linguagem de consulta para APIs, com ele, utilizamos apenas o método POST manipulando os dados com **Query** e **Mutations**, fornecendo uma descrição completa e compreensível dos dados em sua API, conseguindo fazer com que os clientes apenas possam solicitar exatamente o que eles precisam e nada mais.
[Tutorial de introdução ao GraphQL](https://dev.elo.com.br/blog/introducao-ao-graphql)

- O type **Query** serve para definir o contrato de consulta de dados, ele é comparável com o verbo GET logo abaixo é possível visualizar um exemplo do type query.
 
~~~javascript
   query {
     bin(number: "509069") {
       issuer {
         name
       }
     }
   }
~~~
 
Retorno (geralmente JSON):
 
```json
{
 "bin": {
   "issuer": {
     "name": "Banco do Brasil"
   }
 }
}
```
- O type **Mutation** serve para definir o contrato de manipulação de dados. A funcionalidade dele é comparável com a dos verbos POST, PUT, PATCH e DELETE de APIs REST. Abaixo é possível visualizar um exemplo do type Mutation:
 
~~~javascript
   type Mutation {
       addStudy(study: StudyInput!): Study
   }
~~~
 
## Criando a aplicação em Node.js
 
Para isso criei uma aplicação disponível acima em Node JS, onde basicamente permite que o usuário digite os 6 primeiros números do cartão (BIN) e retorne as informações disponíveis na documentação (exemplo: benefícios que o cartão possui). [Documentação da API Tabela de BINs](https://dev.elo.com.br/documentacao/tabela-de-bins);
 
#### Tecnologias utilizadas
 
- :blue_book: **Typescript** 
- 💹 **Node Js**
- 💹 **MongoDb**


1-  Certifique-se de ter o **Node** e o **MongoDB** instalado, ou faça a instalação do Node
[Instalação do Nodejs](https://nodejs.org/en/download/) e a do MongoDB [Instalação do MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/) ;

  1.1 O node possui um gerenciador de pacotes padrão chamado npm (Node Package Manager), porém existe um gerenciador diferente chamado yarn.

2- Inicie o projeto criando o **package.json** com o seguinte comando no terminal:

```console
npm init

yarn init
```

3- Instale o **ts-node**, **ts-node-dev** e o **typescript** como dependências de desenvolvimento:

```console
npm i ts-node ts-node-dev typescript -D

yarn add ts-node ts-node-dev typescript -D
```

3.1 - Instale o arquivo de configuração do typescript: 

```console
npx typescript --init
```

4- Abra o arquivo **package.json** e insira o script `"dev:server": "ts-node-dev --transpile-only --ignore-watch node_modules --respawn index.ts" ` dentro de `scripts` para iniciar o servidor 
```json
{
  "name": "desafio-prensa",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "dev:server": "ts-node-dev --transpile-only --ignore-watch node_modules --respawn index.ts"
  },
  "author": "Wellington Santos",
  "license": "MIT",
  "devDependencies": {
    "ts-node": "^9.0.0",
    "ts-node-dev": "^1.0.0",
    "typescript": "^4.0.5"
  }
}
```

4.1- Para iniciar a aplicação utilize o comando

```console
npm run dev:server

yarn dev:server
```
 
## Criando aplicação e conectando com o a api da ELO

1- Instale as dependências e suas tipagens como depedência de desenvolvimento:

```console
npm i express body-parser dotenv ejs express mongoose node-fetch
npm i @types/body-parser @types/dotenv @types/ejs @types/express @types/mongoose @types/node-fetch -D

yarn add express body-parser dotenv ejs express mongoose node-fetch
yarn i @types/body-parser @types/dotenv @types/ejs @types/express @types/mongoose @types/node-fetch -D
```

2. Após ter iniciado na plataforma da (elo) como explico logo acima, crie o arquivo `.env` na raiz do projeto e preencha os campos **CLIENT_ID e SECRET**
   
~~~javascript
//Cliend_id fornecido na api da elo
 CLIENT_ID=
 //Token fornecido na api da elo
 SECRET=
~~~

3. Crie uma pasta chamada `src` dentro dela crie um arquivo chamado `server.ts` com o seguinte código:

~~~javascript
import dotenv from 'dotenv'
import express from 'express';
import bodyParser from 'body-parser'
import './database'

//importação das rotas do nosso projeto
import routes from './routes/bins.routes'

//inicializa a biblioteca dotenv para gerenciamento de nossas variáveis de ambiente
dotenv.config()

const app = express();


//setamos o ejs como template engine do nosso projeto com ele conseguimos de uma maneira fácil e simples transportar dados do back-end para o front-end, basicamente conseguimos utilizar códigos em javascript no html de nossas páginas.Aug
app.set('view engine', 'ejs');
app.set("views", "./src/views");

// Indica para o express usar o JSON parsing do body-parser
app.use(bodyParser.urlencoded({ extended: true }))

app.use(routes)

app.listen(3333, () => console.log('Web app running on port 3333'))
~~~

## Configurando e conectando com o nosso banco de dados

1- Crie uma pasta chamada `database` dentro de `src` um arquivo chamado `index.ts` para conectar com o MongoDB com o seguinte código:


```javascript
import { connect } from 'mongoose';

export function createConnection(): void {
  try {
    connect('mongodb://localhost:27017/bins', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log(error);
  }
}

createConnection();
```

2. Crie uma pasta chamada `models` dentro de `src` e crie um arquivo chamado `Bin.ts` dentro 
esse arquivo irá descrever os campos do nosso documento no banco de dados.

```javascript
import { Schema, Document } from 'mongoose'

//tipagem dos campos do nosso documento
export interface IBin extends Document {
  numberBin: string,
  issuer: { name: string },
  product: { name: string },
  allowedCaptures: [
    { name: string, code: number },
  ],
  usages: [
    { name: string, code: number },
  ],
  services: [
    { name: string, isExchangeableOffer: boolean }
  ]
}


//esquima do nosso documento
export const BinShema: Schema = new Schema({
  numberBin: { type: String, required: true },
  issuer: {
    name: { type: String, required: true }
  },
  product: {
    name: { type: String, required: true }
  },
  allowedCaptures: [
    {
      name: { type: String },
      code:  { type: Number }
    },
  ],
  usages: [
    {
      name: { type: String },
      code:  { type: Number }
    },
  ],
  services: [
    {
      name: { type: String },
      isExchangeableOffer: { type: Boolean }
    }
  ]
})
```

3.  Crie uma pasta chamada `repositories` dentro de `src` e crie um arquivo chamado `BinRepository` 
esse arquivo será responsavel pela manipulação dos nossos dados no banco.

```javascript
import { model } from 'mongoose'

import { BinShema, IBin } from '../models/Bin'

export default model<IBin>('Bin', BinShema);
```

### Configurando a API da ELO

1. Dentro de `src` crie uma pasta chamada `utils` e dentro de `utils` crie uma pasta chamada `graphQL` com os arquivos `api.ts` e `Queries.ts`.
   
Com este arquivo `api.ts` é possível chamar a API da (elo) passando por parâmetro **query** e **variables**
 
```javascript
import fetch from 'node-fetch'

//função para chamar a api da (elo) onde devera ser passado por parâmetro a Query de consulta e as variáveis que a query exige.

export const api = async ({	
 query,	
 variables	
}: {	
 query: string,	
 variables: Record<string, unknown>	
}) => {	
 const response = await fetch('https://hml-API.elo.com.br/graphql', {	
   method: 'POST',	
   headers: {	
     'access_token': process.env.SECRET as string, /*=> token de acesso á API*/	
     'Content-Type': 'application/json',	
     'client_id': process.env.CLIENT_ID as string /*=> cliente_id fornecido ao criar a aplicação na plataforma elo*/	
   },	
   body: JSON.stringify({	
     /*query, => query para consulta	
     variables*/ /*=> viriavel que passaremos como parametro para consulta de BIN*/	
   })	
 })	
 	
 return response	
}	

```
   
Com este arquivo `Queries.ts` é possível fazer a consulta de bins na api da (elo).
 
~~~javascript
 
export const CLIENT_BIN = `
 query OneBin($bin: String!) {
   bin(number: $bin) {
     # Deverá retornar Banco do Brasil
   issuer {
     name
   }
 
   # Deverá retornar Grafite
   product {
     name
   }
 
   # Capturas permitidas (i.e: ponto de venda `POS`, Internet,
   # Telemarketing...)
   allowedCaptures {
     name
     code
   }
 
   # Usos permitidos (i.e: Crédito à Vista, Débito, Parcelado pela
   # Loja...)
   usages {
     name
     code
   }
 
   # Serviços (benefícios) ao portador (i.e: Seguro de Viagem,
   # Proteção de Compra, Garantia Estendida, WiFi)
   services {
     name
     isExchangeableOffer
   }
   }
 }
`
~~~
### Consumindo a API da ELO

1. Crie uma pasta chamada `service` dentro de `src` e crie um arquivo chamado `CreateBinService.ts`, com o seguinte código
   
```javascript
import { api } from '../utils/graphQL/api'
import { CLIENT_BIN } from '../utils/graphQL/Queries'
import binRepository from '../repositories/BinRepository'

class CreateBinService {
  //Com este metodo é possive cadastrar os dados que recebemos ao chamar a api da ELO
  public async execute(numberBin: string) {
    //validando se existe o numBin 
    if(!numberBin) {
      throw new Error('Preencha o campo BIN corretamente!"')
    }

    //Faz uma consulta no banco de dados para verificar se os dados deste número de bin já foi cadastrado
    const binExists = await binRepository.findOne({ numberBin: numberBin })
    
    //Retorna um erro se este numero de bin já existe na base
    if (binExists) {
      throw new Error('BIN já cadastrado na base!')
    }

    //chama a função api que criamos anteriormente e passamos por parâmetro a nossa query e o numberBin
    const eloCall = await api({
      query: CLIENT_BIN,
      variables: {
        bin: numberBin
      }
    })

    //transforma os dados que recebemos da api da (ELO) em formato json
    const eloResponse = await eloCall.json()
    

    //faz a validação para ver se realmente recebemos os dados do BIN fornecido
    if (!eloResponse.data.bin) {
      throw new Error('Numero do BIN invalido!')
    }


    const data = {
      numberBin,
      ...eloResponse.data.bin
    }
    
    //fazemos o cadastro no banco de dados
    const bin = await binRepository.create(data)

    //retornamos os dados deste bin cadastrado
    return bin;
  }
}

export default CreateBinService
```

2. Crie uma pasta chamada `controllers` dentro de `src` e crie um arquivo chamado `BinsController.ts`, com o seguinte código

```javascript
import { Request, Response } from "express";
import CreateBinService from "../services/CreateBinService";
import binRepository from '../repositories/BinRepository'

class BinsController {
  //Metodo para listar todos os dados de BINS cadastrados no nosso banco de dados
  public async index(request: Request, response: Response) {
    try {
    const listBins = await binRepository.find()

    return response.render('index', {
      listBins: listBins,
      error: {}
    })
    } catch (error) {
      const listBins = await binRepository.find()

      return response.render('index', {
        listBins: listBins,
        error: error.message
      })
    }
  }

  //método para receber o número de bin do nosso front end e passar por parâmetro para função execute no nosso service de criação de BINs

  public async store(request: Request, response: Response) {
    try {
      const { bin } = request.body;
      
      const createBin = new CreateBinService()

      await createBin.execute(bin)

      return response.redirect('/')
    } catch (error) {
      const listBins = await binRepository.find()

      return response.render('index', {
        listBins: listBins,
        error: error.message
      })
    }
  }
}

export default BinsController; 
```
3. - Configure as rotas do nosso projeto criando uma pasta chamada `routes` dentro de `src` e crie um arquivo chamado `routes.bins.ts`, com o seguinte código

```javascript
import { Router } from 'express'

import BinsController from '../controllers/BinsController'

const binsController = new BinsController()

const routes = Router()

routes.get('/', binsController.index)

routes.post('/', binsController.store)

export default routes;
```
4. Configure as views do nosso projeto criando uma pasta chamada `views` dentro de `src` e crie um arquivo chamado `index.ejs`, com o seguinte código
  
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Desafio Prensa</title>
  <style>
    body {
      font-size: 16px;
      background: #eeeeee;
      color: #ffff;
    }

    h1 {
      font-size: 35px;
      color: #666666
    }

    .main {
      margin-top: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-weight: 800;
    }

    .main div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 400px;
      margin-bottom: 20px;
      padding: 30px 80px;
      border-radius: 10px;
      box-shadow: 0 0 3px 0 #bbbb;
      color: #666666;
      background-color: #ffff;
    }

    .main div ul {
      margin: 0 auto;
      list-style: none;
    }

    .alert {
      color: red;
    }

    input {
      width: 300px;
      height: 40px;
      padding: 0 10px;
      border: 0;
      background-color: #ffff;
      font-size: 16px;
      outline: 0;
    }

    button {
      height: 40px;
      text-transform: capitalize;
      background-color: #101010;
      color: #ffff;
      font-weight: 800;
      border: 0;
      outline: 0;
      padding: 0 10px;
    }

    button:hover {
      opacity: 0.6;
    }
  </style>
</head>
<body>
  <div class="main">
    <form action="/" method="POST">
      <input type="text" name="bin" placeholder="Digite o numero do BIN">
      <button>enviar</button>
    </form>

    <% if(error.length > 0) { %>
      <p class="alert"><%= error %></p>
    <% } %>

    <% if (listBins.length > 0) { %>
    

    <h1>BINs cadastrados</h1>
      <% listBins.map(item => { %>
      <div>
        <p>BIN: <%= item.numberBin %></p>
        <ul>
          <li>Emissor: <%= item.issuer.name %></li>
          <li>Produto: <%= item.product.name %></li>
          <li>Transações Permitidas</li>
          <ul>
              <% item.allowedCaptures.map(allowedCaptures => { %>
              <li><%= allowedCaptures.name %></li>
            <% }) %>
          </ul>
          <li>Usos</li>
          <ul>
            <% item.usages.map(usages => { %>
              <li><%= usages.name %></li>
            <% }) %>
          </ul>
          <% if(item.services.length > 0) { %>
          <li>Serviços</li>
          <ul>
            <% item.services.map(services => { %>
              <li><%= services.name %></li>
            <% }) %>
          </ul>
          <% } %>
        </ul>
        </div>
      <% }) %>
    <% } %>
  </div>
</body>
</html>
```
5. Inicie o servidor com o comando `yarn dev:server`, abra seu navegador e a aplicação estará disponível em `http://localhost:3333`

## Material para ajudar
[Github com repositórios de exemplos de consumo de APIs Elo](https://github.com/cartaoelo)


