import z from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { isEditAuthorized, isViewAuthorized } from "./projectAuthUtil";

export const documentRouter = router({
  getDocument: publicProcedure
    .input(
      z
        .object({ documentId: z.string(), documentSlug: z.string() })
        .partial()
        .refine((d) => !!d.documentId || !!d.documentSlug)
    )
    .query(async ({ ctx, input }) => {
      const [document, project] = await Promise.all([
        ctx.prisma.document.findFirst({
          where: {
            id: input.documentId,
            slug: input.documentSlug,
          },
          select: {
            id: true,
            slug: true,
            content: true,
            createdAt: true,
            project: {
              select: {
                id: true,
                slug: true,
                name: true,
              },
            },
          },
        }),
        ctx.prisma.project.findFirst({
          where: {
            revisions: {
              some: {
                OR: [
                  {
                    id: {
                      equals: input.documentId,
                    },
                  },
                  {
                    slug: {
                      equals: input.documentSlug,
                    },
                  },
                ],
              },
            },
          },
          select: {
            public: true,
            viewers: {
              select: {
                id: true,
              },
            },
            editors: {
              select: {
                id: true,
              },
            },
            owner: {
              select: {
                id: true,
              },
            },
          },
        }),
      ]);

      if (!document || !project) throw new TRPCError({ code: "NOT_FOUND" });
      if (!isViewAuthorized(project, ctx.session?.user?.id))
        throw new TRPCError({ code: "UNAUTHORIZED" });
      return document;
    }),
  document: protectedProcedure
    .input(z.object({ documentId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const document = await ctx.prisma.document.findFirst({
        where: {
          id: input.documentId,
        },
        select: {
          project: {
            select: {
              public: true,
              revisions: {
                orderBy: {
                  createdAt: "desc",
                },
                take: 1,
              },
              viewers: {
                select: {
                  id: true,
                },
              },
              editors: {
                select: {
                  id: true,
                },
              },
              owner: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
      if (!document) throw new TRPCError({ code: "NOT_FOUND" });
      if (!isEditAuthorized(document.project, ctx.session.user.id))
        throw new TRPCError({ code: "UNAUTHORIZED" });

      // The user is trying to update a document that is not the head
      if (document.project.revisions[0]?.id !== input.documentId)
        throw new TRPCError({ code: "BAD_REQUEST" });

      await ctx.prisma.document.update({
        where: {
          id: input.documentId,
        },
        data: {
          content: input.content,
        },
      });
    }),

  fork: protectedProcedure
    .input(z.object({ documentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const document = await ctx.prisma.document.findFirst({
        where: {
          id: input.documentId,
        },
        select: {
          content: true,
          project: {
            select: {
              name: true,
              public: true,
              viewers: {
                select: {
                  id: true,
                },
              },
              editors: {
                select: {
                  id: true,
                },
              },
              owner: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
      if (!document) throw new TRPCError({ code: "NOT_FOUND" });
      isViewAuthorized(document.project, ctx.session.user.id);

      const project = await ctx.prisma.project.create({
        data: {
          name: `${document.project.name} - forked`,
          owner: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          revisions: {
            create: {
              content: document.content,
              published: true,
            },
          },
        },
      });
    }),
});
