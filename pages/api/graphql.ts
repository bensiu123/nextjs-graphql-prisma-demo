import { ApolloServer } from "apollo-server-micro";
import { schema } from "../../graphql/schema";
import { resolvers } from "../../graphql/resolvers";
import Cors from "micro-cors";
import { NextApiRequest, NextApiResponse, NextConfig } from "next";
import { createContext } from "../../graphql/context";

const cors = Cors();

const apolloServer = new ApolloServer({
  schema,
  resolvers,
  context: createContext,
});

const startServer = apolloServer.start();

export default cors(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await startServer;

  await apolloServer.createHandler({ path: "/api/graphql" })(req, res);
});

export const config: NextConfig = {
  api: {
    bodyParser: false,
  },
};
