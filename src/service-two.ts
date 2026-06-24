import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { gql } from "graphql-tag";

const typeDefs = gql`
  type Query {
    service: String
    serviceVersion: String
  }
`;

const resolvers = {
  Query: {
    service: () => {
      return "Service two";
    },
    serviceVersion: () => {
      return "v0.0.1";
    },
  },
};

export async function initServiceTwo() {
  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
  });

  const url = await startStandaloneServer(server, {
    listen: {
      port: 3002,
    },
  });

  console.log("server started ", 3002);
}

