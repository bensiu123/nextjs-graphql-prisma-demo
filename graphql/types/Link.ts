import { objectType, extendType, intArg, stringArg, nonNull } from "nexus";
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

export const CreateLinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createLink", {
      type: Link,
      args: {
        title: nonNull(stringArg()),
        url: nonNull(stringArg()),
        imageUrl: nonNull(stringArg()),
        category: nonNull(stringArg()),
        description: nonNull(stringArg()),
      },
      async resolve(_parent, args, ctx) {
        if (!ctx.user)
          throw new Error(`You need to be logged in to perform this action`);

        const user = await ctx.prisma.user.findUnique({
          where: { email: ctx.user.email },
        });

        if (user.role !== "ADMIN") throw new Error("Unauthorized access");

        const { title, url, imageUrl, category, description } = args;
        const newLink = {
          title,
          url,
          imageUrl,
          category,
          description,
        };

        return await ctx.prisma.link.create({ data: newLink });
      },
    });
  },
});

export const UpdateLinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateLink", {
      type: Link,
      args: {
        id: nonNull(stringArg()),
        title: stringArg(),
        url: stringArg(),
        imageUrl: stringArg(),
        category: stringArg(),
        description: stringArg(),
      },
      async resolve(_parent, args, ctx) {
        if (!ctx.user)
          throw new Error(`You need to be logged in to perform this action`);

        const user = await ctx.prisma.user.findUnique({
          where: { email: ctx.user.email },
        });

        if (user.role !== "ADMIN") throw new Error("Unauthorized access");

        const { id, title, url, imageUrl, category, description } = args;
        const newLink = {
          title,
          url,
          imageUrl,
          category,
          description,
        };

        return await ctx.prisma.link.update({ where: { id }, data: newLink });
      },
    });
  },
});

export const DeleteLinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteLink", {
      type: Link,
      args: {
        id: nonNull(stringArg()),
      },
      async resolve(_parent, args, ctx) {
        if (!ctx.user)
          throw new Error(`You need to be logged in to perform this action`);

        const user = await ctx.prisma.user.findUnique({
          where: { email: ctx.user.email },
        });

        if (user.role !== "ADMIN") throw new Error("Unauthorized access");

        const { id } = args;

        return await ctx.prisma.link.delete({ where: { id } });
      },
    });
  },
});

export const AddLinkToBookmarkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("addLinkToBookmark", {
      type: Link,
      args: {
        id: nonNull(stringArg()),
      },
      async resolve(_parent, args, ctx) {
        if (!ctx.user)
          throw new Error(`You need to be logged in to perform this action`);

        const user = await ctx.prisma.user.findUnique({
          where: { email: ctx.user.email },
        });

        /** @todo */
        // ctx.prisma.user.findUnique({
        //   where: { email: ctx.user.email },
        // }).bookmarks()
        return {};
      },
    });
  },
});

export const RemoveLinkFromBookmarkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("removeLinkFromBookmark", {
      type: Link,
      args: {
        id: nonNull(stringArg()),
      },
      async resolve(_parent, args, ctx) {
        if (!ctx.user)
          throw new Error(`You need to be logged in to perform this action`);

        const user = await ctx.prisma.user.findUnique({
          where: { email: ctx.user.email },
        });

        /** @todo */
        return {};
      },
    });
  },
});
