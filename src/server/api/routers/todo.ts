// import { z } from "zod";
// import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// export const todoRouter = createTRPCRouter({
//     getAll: publicProcedure
//         .input(z.object({ userId: z.string() }))
//         .query(({ ctx, input }) => {
//             return ctx.db.todo.findMany({
//                 where: { userId: input.userId },
//                 orderBy: { createdAt: "desc" },
//             });
//         }),

//     create: publicProcedure
//         .input(z.object({ userId: z.string(), title: z.string(), url: z.string() }))
//         .mutation(({ ctx, input }) => {
//             return ctx.db.todo.create({
//                 data: {
//                     userId: input.userId,
//                     title: input.title,
//                     url: input.url,
//                 },
//             });
//         }),

//     delete: publicProcedure
//         .input(z.object({ id: z.string() }))
//         .mutation(({ ctx, input }) => {
//             return ctx.db.todo.delete({
//                 where: { id: input.id },
//             });
//         }),

//     toggle: publicProcedure
//         .input(z.object({ id: z.string(), completedAt: z.date().nullable() }))
//         .mutation(({ ctx, input }) => {
//             return ctx.db.todo.update({
//                 where: { id: input.id },
//                 data: { completedAt: input.completedAt },
//             });
//         }),
// });
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const todoRouter = createTRPCRouter({
    getAll: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.todo.findMany({
                where: { userId: input.userId },
                orderBy: { createdAt: "desc" },
            });
        }),

    create: publicProcedure
        .input(z.object({ userId: z.string(), title: z.string(), url: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.todo.create({
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
            return ctx.db.todo.delete({
                where: { id: input.id },
            });
        }),

    toggle: publicProcedure
        .input(z.object({ id: z.string(), completedAt: z.date().nullable() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.todo.update({
                where: { id: input.id },
                data: { completedAt: input.completedAt },
            });
        }),
});
