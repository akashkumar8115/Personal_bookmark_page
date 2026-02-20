// import { z } from "zod";
// import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// export const bookmarkRouter = createTRPCRouter({
//   getAll: publicProcedure
//     .input(z.object({ userId: z.string() }))
//     .query(({ ctx, input }) => {
//       return ctx.db.bookmark.findMany({
//         where: { userId: input.userId },
//         orderBy: { createdAt: "desc" },
//       });
//     }),

//   create: publicProcedure
//     .input(z.object({ userId: z.string(), title: z.string(), url: z.string() }))
//     .mutation(({ ctx, input }) => {
//       return ctx.db.bookmark.create({
//         data: {
//           userId: input.userId,
//           title: input.title,
//           url: input.url,
//         },
//       });
//     }),

//   delete: publicProcedure
//     .input(z.object({ id: z.string() }))
//     .mutation(({ ctx, input }) => {
//       return ctx.db.bookmark.delete({
//         where: { id: input.id },
//       });
//     }),

//   update: publicProcedure
//     .input(z.object({ id: z.string(), title: z.string(), url: z.string() }))
//     .mutation(({ ctx, input }) => {
//       return ctx.db.bookmark.update({
//         where: { id: input.id },
//         data: { title: input.title, url: input.url },
//       });
//     }),
// });

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const bookmarkRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.bookmark.findMany({
        where: { userId: input.userId },
        orderBy: { createdAt: "desc" },
      });
    }),

  create: publicProcedure
    .input(z.object({ userId: z.string(), title: z.string(), url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.bookmark.create({
        data: {
          userId: input.userId,
          title: input.title,
          url: input.url,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.bookmark.delete({
        where: { id: input.id },
      });
    }),

  update: publicProcedure
    .input(z.object({ id: z.string(), title: z.string(), url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.bookmark.update({
        where: { id: input.id },
        data: { title: input.title, url: input.url },
      });
    }),
});
