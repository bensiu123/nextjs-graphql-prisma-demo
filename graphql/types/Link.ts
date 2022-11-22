import { objectType, extendType, intArg, stringArg } from "nexus";
import { User } from "./User";
export const Link = objectType({
  name: "Link",
  definition(t) {
    t.string("id");
    t.string("title");
    t.string("url");
    t.string("description");
    t.string("imageUrl");
    t.string("category");
    t.list.field("users", {
      type: User,
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.link
          .findUnique({ where: { id: _parent.id } })
          .users();
      },
    });
  },
});

export const LinksQuery = extendType({
  type: "Query",
  definition(t) {
    // t.nonNull.list.field("links", {
    //   type: Link,
    //   resolve(_parent, _args, ctx) {
    //     return ctx.prisma.link.findMany();
    //   },
    // });

    t.field("links", {
      type: Response,
      args: {
        first: intArg(),
        after: stringArg(),
      },
      async resolve(_, args: { first: number; after?: string }, ctx) {
        const queryResults = await ctx.prisma.link.findMany({
          take: args.first,
          skip: args.after ? 1 : undefined,
          cursor: args.after ? { id: args.after } : undefined,
        });

        if (queryResults.length === 0)
          return {
            pageInfo: { endCursor: null, hasNextPage: false },
            edges: [],
          };

        const lastLinkInResults = queryResults[queryResults.length - 1];
        const myCursor = lastLinkInResults.id;

        const secondQueryResults = await ctx.prisma.link.findMany({
          take: 1,
          skip: 1,
          cursor: { id: myCursor },
          // orderBy: { id: "asc" },
        });

        const result = {
          pageInfo: {
            endCursor: myCursor,
            hasNextPage: secondQueryResults.length > 0,
          },
          edges: queryResults.map((link) => ({
            cursor: link.id,
            node: link,
          })),
        };

        return result;
      },
    });
  },
});

export const Edge = objectType({
  name: "Edge",
  definition(t) {
    t.string("cursor");
    t.field("node", {
      type: Link,
    });
  },
});

export const PageInfo = objectType({
  name: "PageInfo",
  definition(t) {
    t.string("endCursor");
    t.boolean("hasNextPage");
  },
});

export const Response = objectType({
  name: "Response",
  definition(t) {
    t.field("pageInfo", { type: PageInfo });
    t.list.field("edges", { type: Edge });
  },
});
