import { ApolloServer } from "@apollo/server";

import { startStandaloneServer } from "@apollo/server/standalone";

import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "one", url: "http://localhost:3003/graphql" },
      { name: "two", url: "http://localhost:3002/graphql" },
    ],
  }),
});

export async function initGateway() {
  const server = new ApolloServer({ gateway });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
  });

  console.log("Gateway is running at ", url);
}
