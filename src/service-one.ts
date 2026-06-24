import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { gql } from "graphql-tag";

const typeDefs = gql`
  type Query {
    hello: String
    version: String
  }
`;

const resolvers = {
  Query: {
    hello: () => {
      return "world";
    },
    version: () => {
      return "v0.0.1";
    },
  },
};

export async function initServiceOne() {
  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
  });

  const url = await startStandaloneServer(server, {
    listen: {
      port: 3003,
    },
  });

  console.log("server started ", 3003);
}

