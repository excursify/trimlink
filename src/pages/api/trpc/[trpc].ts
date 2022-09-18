import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import { prisma } from "../../../db/client";

export const appRouter = trpc
  .router()
  .query("slugCheck", {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input }) {
      const count = await prisma.trimLink.count({
        where: {
          slug: input.slug,
        },
      });
      return { used: count > 0 };
    },
  })
  .mutation("createSlug", {
    input: z.object({
      slug: z.string(),
      url: z.string(),
    }),
    async resolve({ input }) {
      try {
        await prisma.trimLink.create({
          data: {
            slug: input.slug,
            url: input.url,
          },
        });
      } catch (ex) {
        console.log(ex);
      }
    },
  });

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
