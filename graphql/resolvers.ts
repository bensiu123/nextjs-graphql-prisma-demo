import { IExecutableSchemaDefinition } from "@graphql-tools/schema";
import { Context } from "./context";

/** @deprecated */
export const resolvers: IExecutableSchemaDefinition<Context>["resolvers"] = {
  Query: {
    links: (_parent, _args, ctx) => {
      return ctx.prisma.link.findMany();
    },
  },
};
