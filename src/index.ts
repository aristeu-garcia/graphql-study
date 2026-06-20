import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#grapql
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
        return "v0.0.1"
    }
  },
};

async function init() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const url = await startStandaloneServer(server, {
    listen: {
      port: 3000,
    },
  });

  console.log('server started ', 3000)
}

init()
