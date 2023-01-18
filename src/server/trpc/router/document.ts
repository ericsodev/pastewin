import z from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { isEditAuthorized, isViewAuthorized, getAuthority } from "./projectAuthUtil";

export const documentRouter = router({
  getDocument: publicProcedure
    /**
     * This endpoint retrieves a document using either the document's ID or Slug
     *
     * Authorization Checks
     * - If it is part of a project
     *  - Check if the project is public or if the user has a viewer role or higher
     * - If it is a standalone document
     *  - Then it is public
     *
     * Returns
     * - Document ID, Slug
     * - Name, Content, Created Date
     * - Project Name, Owner Name
     */
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
            name: true,
            slug: true,
            content: true,
            createdAt: true,
            viewOnly: true,
            project: {
              select: {
                id: true,
                slug: true,
                name: true,
                owner: {
                  select: {
                    displayName: true,
                  },
                },
              },
            },
          },
        }),
        ctx.prisma.project.findFirst({
          where: {
            documents: {
              some: {
                OR: [
                  {
                    id: input.documentId,
                  },
                  {
                    slug: input.documentSlug,
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

      if (!document) throw new TRPCError({ code: "NOT_FOUND" });

      if (!project) {
        // This is a standalone document, all viewers have access
        return { ...document, role: "GUEST" };
      }

      if (!isViewAuthorized(project, ctx.session?.user?.id))
        throw new TRPCError({ code: "UNAUTHORIZED" });
      return { ...document, role: getAuthority(project, ctx.session?.user?.id) };
    }),
  document: protectedProcedure
    /**
     * This endpoint mutates a documents content and/or name.
     *
     * Authorization Checks (the document must be a part of a project)
     * - Editor
     * - Owner
     *
     */
    .input(
      z.object({
        documentId: z.string(),
        name: z.string().min(1).max(35).optional(),
        content: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const document = await ctx.prisma.document.findFirst({
        where: {
          id: input.documentId,
        },
        select: {
          viewOnly: true,
          project: {
            select: {
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
      if (!document.project)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The document being mutated is not part of a project",
        });
      if (!isEditAuthorized(document.project, ctx.session.user.id))
        throw new TRPCError({ code: "UNAUTHORIZED" });
      if (document.viewOnly)
        throw new TRPCError({ code: "BAD_REQUEST", message: "The document is view only." });
      await ctx.prisma.document.update({
        where: {
          id: input.documentId,
        },
        data: {
          name: input.name,
          content: input.content,
        },
      });
    }),

  fork: protectedProcedure
    /**
     * This endpoint creates a new project containing this document
     *
     * Authorization Check
     * - If this document is a part of a project
     *  - The project is public or the user has viewer authority
     * - If this document is standalone, then any user can fork.
     *
     * Returns
     * - ID and Slug of the created project
     */
    .input(z.object({ documentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const document = await ctx.prisma.document.findFirst({
        where: {
          id: input.documentId,
        },
        select: {
          name: true,
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
      if (document.project && !isViewAuthorized(document.project, ctx.session.user.id))
        throw new TRPCError({ code: "UNAUTHORIZED" });

      return await ctx.prisma.project.create({
        data: {
          name: `${document.name} - forked`,
          owner: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          documents: {
            create: {
              content: document.content,
              viewOnly: false,
            },
          },
        },
        select: {
          id: true,
          slug: true,
        },
      });
    }),
  publishDocument: protectedProcedure
    /**
     * This endpoint saves the current document as a revision
     *
     * Authorization Check - (document must be part of a project)
     * - Owner
     */
    .input(z.object({ documentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const document = await ctx.prisma.document.findUnique({
        where: {
          id: input.documentId,
        },
        select: {
          id: true,
          name: true,
          content: true,
          project: {
            select: {
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
      if (!document.project)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The document being mutated is not part of a project",
        });

      // Check if user is owner
      if (ctx.session.user.id !== document.project.owner.id)
        throw new TRPCError({ code: "UNAUTHORIZED" });

      await ctx.prisma.revision.create({
        data: {
          document: {
            connect: {
              id: document.id,
            },
          },
          name: document.name,
          content: document.content,
        },
      });
    }),

  revertDocument: protectedProcedure
    /**
     * This endpoint reverts the document to a previous revision,
     * deleting all revisions in between (including the target revision)
     *
     * Authorization Check - (document must be part of a project)
     * - Owner
     */
    .input(
      z.object({
        documentId: z.string(),
        revisionId: z.string(),
        contentOnly: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const document = await ctx.prisma.document.findUnique({
        where: {
          id: input.documentId,
        },
        select: {
          name: true,
          revisions: {
            where: {
              id: input.revisionId,
            },
            select: {
              id: true,
              name: true,
              content: true,
              createdAt: true,
            },
          },
          project: {
            select: {
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
      if (!document.project)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The document being mutated is not part of a project",
        });

      if (document.project.owner.id !== ctx.session.user.id)
        throw new TRPCError({ code: "UNAUTHORIZED" });

      // Check if a document with this revision does not exist
      const revision = document.revisions[0];
      if (!revision || revision.id !== input.revisionId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This revision is not part of the document",
        });

      await ctx.prisma.document.update({
        where: {
          id: input.documentId,
        },
        data: {
          name: input.contentOnly ? undefined : revision.name,
          content: revision.content,
          revisions: {
            deleteMany: {
              createdAt: {
                gte: revision.createdAt,
              },
            },
          },
        },
      });
    }),
  createStandalone: publicProcedure
    /**
     * This endpoint creates a standalone document given a name and content
     *
     * Returns
     * - Slug of the created document
     */
    .input(z.object({ name: z.string().min(1).max(35), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.document.create({
        data: {
          name: input.name,
          content: input.content,
          viewOnly: true,
        },
        select: {
          slug: true,
        },
      });
    }),
});
