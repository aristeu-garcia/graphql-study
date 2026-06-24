# GraphQL POC — Apollo Federation

Prova de conceito de uma arquitetura de **GraphQL Federation** com Apollo. A ideia é compor um único grafo (supergraph) a partir de vários serviços GraphQL independentes (subgraphs), expostos ao cliente por meio de um **gateway** único.

## Arquitetura

```
                 ┌─────────────────────────┐
   Cliente ────► │   Gateway (porta 3000)  │
                 │   @apollo/gateway       │
                 └───────────┬─────────────┘
                             │ compõe o supergraph
              ┌──────────────┴───────────────┐
              ▼                              ▼
   ┌────────────────────┐         ┌────────────────────┐
   │ Service One (3003) │         │ Service Two (3002) │
   │ subgraph           │         │ subgraph           │
   │  Query.hello       │         │  Query.service     │
   │  Query.version     │         │  Query.serviceVer. │
   └────────────────────┘         └────────────────────┘
```

- **Service One** ([src/service-one.ts](src/service-one.ts)) — subgraph na porta `3003`, expõe `hello` e `version`.
- **Service Two** ([src/service-two.ts](src/service-two.ts)) — subgraph na porta `3002`, expõe `service` e `serviceVersion`.
- **Gateway** ([src/gateway.ts](src/gateway.ts)) — na porta `3000`, descobre e une os dois subgraphs em um único grafo.
- **Entry point** ([src/index.ts](src/index.ts)) — sobe os três servidores no mesmo processo (apenas para a POC).

## Como funciona

Cada serviço é um **subgraph** independente: usa `buildSubgraphSchema` do `@apollo/subgraph` para criar um schema GraphQL compatível com Federation e roda como um `ApolloServer` standalone na sua própria porta.

O **gateway** usa `IntrospectAndCompose` do `@apollo/gateway` para:

1. Fazer introspecção dos subgraphs configurados (`one` em `:3003`, `two` em `:3002`).
2. Compor automaticamente um **supergraph** unindo os schemas de todos eles.
3. Expor uma única API GraphQL em `http://localhost:3000`.

Para o cliente, existe apenas **um endpoint**. Ao receber uma query, o gateway roteia cada campo para o subgraph responsável e agrega as respostas — sem que o cliente precise saber que os dados vêm de serviços diferentes.

## Como executar

```bash
npm install
npm run dev
```

O comando `dev` usa `tsx watch` e sobe os três servidores (`index.ts` → `initServiceOne` + `initServiceTwo` + `initGateway`).

Depois acesse `http://localhost:3000` e rode uma query que combina campos dos dois serviços:

```graphql
query {
  hello          # Service One  -> "world"
  version        # Service One  -> "v0.0.1"
  service        # Service Two  -> "Service two"
  serviceVersion # Service Two  -> "v0.0.1"
}
```

## Stack

- [Apollo Server 5](https://www.apollographql.com/docs/apollo-server/)
- [Apollo Gateway / Federation 2](https://www.apollographql.com/docs/federation/)
- TypeScript + [tsx](https://github.com/privatenumber/tsx)
