import { TRPCError } from "@trpc/server";
import z from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { isViewAuthorized } from "./projectAuthUtil";

export const projectRouter = router({
  overview: publicProcedure
    .input(
      z
        .object({ projectId: z.string(), projectSlug: z.string() })
        .partial()
        .refine((d) => !!d.projectId || !!d.projectSlug)
    )
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          AND: [
            {
              OR: [
                // {
                //   id: input.projectId,
                // },
                {
                  slug: input.projectSlug,
                },
              ],
            },
            {
              OR: [
                {
                  public: true,
                },
                {
                  viewers: {
                    some: {
                      id: {
                        equals: ctx.session?.user?.id,
                      },
                    },
                  },
                },
                {
                  editors: {
                    some: {
                      id: {
                        equals: ctx.session?.user?.id,
                      },
                    },
                  },
                },
                {
                  owner: {
                    id: {
                      equals: ctx.session?.user?.id,
                    },
                  },
                },
              ],
            },
          ],
        },
        select: {
          id: true,
          slug: true,
          public: true,
          name: true,
          documents: {
            take: 6,
            orderBy: {
              name: "asc",
            },
            select: {
              id: true,
              name: true,
              slug: true,
              createdAt: true,
            },
          },
          owner: {
            select: {
              id: true,
              displayName: true,
              image: true,
            },
          },
          editors: {
            select: {
              id: true,
              displayName: true,
              image: true,
            },
            orderBy: {
              displayName: "asc",
            },
          },
          viewers: {
            select: {
              id: true,
              displayName: true,
              image: true,
            },
            orderBy: {
              displayName: "asc",
            },
          },
        },
      });

      if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      if (project.public) return { ...project, role: "VIEWER" };
      if (!ctx.session?.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });

      if (project.editors.some((u) => u.id === ctx.session?.user?.id)) {
        return { ...project, role: "EDITOR" };
      }

      if (project.viewers.some((u) => u.id === ctx.session?.user?.id)) {
        return { ...project, role: "VIEWER" };
      }

      if (project.owner.id === ctx.session?.user?.id) {
        return { ...project, role: "OWNER" };
      }
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(35), public: z.boolean().default(true) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.project.create({
        data: {
          owner: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          documents: {
            create: {
              name: input.name,
              content: "",
              viewOnly: false,
            },
          },
          name: input.name,
          public: input.public,
        },
        select: {
          id: true,
          slug: true,
        },
      });
    }),
  createDocument: protectedProcedure
    /**
     * This endpoint creates a new document given a name under a project
     *
     * Authorization Check
     * - Owner
     *
     * Returns
     * - New Document ID and Slug
     */
    .input(z.object({ projectId: z.string(), documentName: z.string().min(1).max(35) }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: {
          id: input.projectId,
        },
        select: {
          owner: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      if (project.owner.id !== ctx.session.user.id) throw new TRPCError({ code: "UNAUTHORIZED" });

      return await ctx.prisma.document.create({
        data: {
          project: {
            connect: {
              id: input.projectId,
            },
          },
          name: input.documentName,
          content: "",
          viewOnly: false,
        },
        select: {
          id: true,
          slug: true,
        },
      });
    }),
  getPinned: publicProcedure
    .input(
      z
        .object({ projectId: z.string(), projectSlug: z.string() })
        .partial()
        .refine((d) => !!d.projectSlug || !!d.projectId)
    )
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          id: input.projectId,
          slug: input.projectSlug,
        },
        select: {
          pinnedDocument: {
            select: {
              id: true,
              slug: true,
              name: true,
              content: true,
            },
          },
          public: true,
          owner: {
            select: {
              id: true,
            },
          },
          editors: {
            select: {
              id: true,
            },
          },
          viewers: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      if (isViewAuthorized(project, ctx.session?.user?.id))
        throw new TRPCError({ code: "UNAUTHORIZED" });
      return project.pinnedDocument;
    }),
  // getHead: publicProcedure
  //   .input(
  //     z
  //       .object({ projectId: z.string(), projectSlug: z.string() })
  //       .partial()
  //       .refine((d) => !!d.projectId || !!d.projectSlug)
  //   )
  //   .query(async ({ ctx, input }) => {
  //     const project = await ctx.prisma.project.findFirst({
  //       where: {
  //         AND: [
  //           {
  //             OR: {
  //               id: input.projectId,
  //               slug: input.projectSlug,
  //             },
  //           },
  //           {
  //             OR: {
  //               public: true,
  //               viewers: {
  //                 some: {
  //                   id: {
  //                     equals: ctx.session?.user?.id,
  //                   },
  //                 },
  //               },
  //               editors: {
  //                 some: {
  //                   id: {
  //                     equals: ctx.session?.user?.id,
  //                   },
  //                 },
  //               },
  //               owner: {
  //                 id: {
  //                   equals: ctx.session?.user?.id,
  //                 },
  //               },
  //             },
  //           },
  //         ],
  //       },
  //       select: {
  //         id: true,
  //         slug: true,
  //         public: true,
  //         revisions: {
  //           take: 1,
  //           orderBy: {
  //             createdAt: "desc",
  //           },
  //           select: {
  //             id: true,
  //             slug: true,
  //             content: true,
  //             createdAt: true,
  //           },
  //         },
  //         owner: {
  //           select: {
  //             id: true,
  //             displayName: true,
  //           },
  //         },
  //         editors: {
  //           select: {
  //             id: true,
  //             displayName: true,
  //           },
  //           orderBy: {
  //             displayName: "asc",
  //           },
  //         },
  //         viewers: {
  //           select: {
  //             id: true,
  //             displayName: true,
  //           },
  //           orderBy: {
  //             displayName: "asc",
  //           },
  //         },
  //       },
  //     });

  //     if (!project) throw new TRPCError({ code: "NOT_FOUND" });
  //     if (!project.public && !ctx.session?.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });

  //     if (project.editors.some((u) => u.id !== ctx.session?.user?.id)) {
  //       throw new TRPCError({ code: "UNAUTHORIZED" });
  //     }

  //     if (project.viewers.some((u) => u.id !== ctx.session?.user?.id)) {
  //       throw new TRPCError({ code: "UNAUTHORIZED" });
  //     }

  //     if (project.owner.id !== ctx.session?.user?.id) {
  //       throw new TRPCError({ code: "UNAUTHORIZED" });
  //     }

  //     return project.revisions[0] ?? null;
  //   }),
  // revertHead: protectedProcedure
  //   .input(z.object({ projectId: z.string(), documentId: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const project = await ctx.prisma.project.findFirst({
  //       where: {
  //         id: input.projectId,
  //         revisions: {
  //           some: {
  //             id: {
  //               equals: input.documentId,
  //             },
  //           },
  //         },
  //       },
  //       select: {
  //         owner: { select: { id: true } },
  //         revisions: {
  //           orderBy: {
  //             createdAt: "asc",
  //           },
  //         },
  //       },
  //     });
  //     if (!project) throw new TRPCError({ code: "NOT_FOUND" });
  //     if (project.owner.id !== ctx.session.user.id) throw new TRPCError({ code: "UNAUTHORIZED" });

  //     const removedRevisions: string[] = [];
  //     let remove = true;
  //     project.revisions.forEach((v) => {
  //       if (v.id === input.documentId) {
  //         remove = false;
  //         return;
  //       }
  //       if (remove) removedRevisions.push(v.id);
  //     });

  //     await ctx.prisma.project.update({
  //       where: {
  //         id: input.projectId,
  //       },
  //       data: {
  //         revisions: {
  //           deleteMany: {
  //             id: {
  //               in: removedRevisions,
  //             },
  //           },
  //         },
  //       },
  //     });
  //   }),
  // publishHead: protectedProcedure
  //   .input(z.object({ projectId: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const project = await ctx.prisma.project.findUnique({
  //       where: {
  //         id: input.projectId,
  //       },
  //       select: {
  //         owner: {
  //           select: {
  //             id: true,
  //           },
  //         },
  //         revisions: {
  //           orderBy: {
  //             createdAt: "desc",
  //           },
  //           take: 1,
  //           select: {
  //             content: true,
  //           },
  //         },
  //       },
  //     });
  //     if (!project) throw new TRPCError({ code: "NOT_FOUND" });
  //     if (project.owner.id !== ctx.session.user.id) throw new TRPCError({ code: "UNAUTHORIZED" });

  //     await ctx.prisma.project.update({
  //       where: {
  //         id: input.projectId,
  //       },
  //       data: {
  //         revisions: {
  //           create: {
  //             content: project.revisions[0]?.content ?? "",
  //           },
  //         },
  //       },
  //     });
  //   }),
  // published: protectedProcedure
  //   .input(z.object({ projectId: z.string(), documentId: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const project = await ctx.prisma.project.findFirst({
  //       where: {
  //         id: input.projectId,
  //         revisions: {
  //           some: {
  //             id: {
  //               equals: input.documentId,
  //             },
  //           },
  //         },
  //       },
  //       select: {
  //         owner: {
  //           select: {
  //             id: true,
  //           },
  //         },
  //       },
  //     });
  //     if (!project) throw new TRPCError({ code: "NOT_FOUND" });
  //     if (project.owner.id !== ctx.session.user.id) throw new TRPCError({ code: "UNAUTHORIZED" });

  //     await ctx.prisma.$transaction([
  //       ctx.prisma.project.update({
  //         where: {
  //           id: input.projectId,
  //         },
  //         data: {
  //           revisions: {
  //             updateMany: {
  //               where: {
  //                 id: {
  //                   not: input.documentId,
  //                 },
  //               },
  //               data: {
  //                 published: false,
  //               },
  //             },
  //           },
  //         },
  //       }),
  //       ctx.prisma.project.update({
  //         where: {
  //           id: input.projectId,
  //         },
  //         data: {
  //           revisions: {
  //             updateMany: {
  //               where: {
  //                 id: {
  //                   equals: input.documentId,
  //                 },
  //               },
  //               data: {
  //                 published: true,
  //               },
  //             },
  //           },
  //         },
  //       }),
  //     ]);
  //   }),
  renameProject: protectedProcedure
    .input(z.object({ projectId: z.string(), newName: z.string().min(1).max(35) }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: {
          id: input.projectId,
        },
        select: {
          owner: {
            select: { id: true },
          },
        },
      });
      if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      if (ctx.session.user.id !== project.owner.id) throw new TRPCError({ code: "UNAUTHORIZED" });

      await ctx.prisma.project.update({
        where: {
          id: input.projectId,
        },
        data: {
          name: input.newName,
        },
      });
    }),
  editable: protectedProcedure
    .input(z.object({ projectId: z.string(), isEditable: z.boolean().default(true) }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: {
          id: input.projectId,
        },
        select: {
          owner: {
            select: { id: true },
          },
        },
      });
      if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      if (ctx.session.user.id !== project.owner.id) throw new TRPCError({ code: "UNAUTHORIZED" });

      await ctx.prisma.project.update({
        where: {
          id: input.projectId,
        },
        data: {
          viewOnly: !input.isEditable,
        },
      });
    }),
  visibility: protectedProcedure
    .input(z.object({ projectId: z.string(), isPublic: z.boolean().default(false) }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: {
          id: input.projectId,
        },
        select: {
          owner: {
            select: { id: true },
          },
        },
      });
      if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      if (ctx.session.user.id !== project.owner.id) throw new TRPCError({ code: "UNAUTHORIZED" });

      await ctx.prisma.project.update({
        where: {
          id: input.projectId,
        },
        data: {
          viewOnly: input.isPublic,
        },
      });
    }),
  invite: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        displayName: z.string(),
        role: z.enum(["EDITOR", "VIEWER"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: {
          id: input.projectId,
        },
        select: {
          owner: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      if (project.owner.id !== ctx.session.user.id) throw new TRPCError({ code: "UNAUTHORIZED" });

      if (input.role === "EDITOR") {
        await ctx.prisma.project.update({
          where: {
            id: input.projectId,
          },
          data: {
            editors: {
              connect: {
                displayName: input.displayName,
              },
            },
          },
        });
      }
      if (input.role === "VIEWER") {
        await ctx.prisma.project.update({
          where: {
            id: input.projectId,
          },
          data: {
            viewers: {
              connect: {
                displayName: input.displayName,
              },
            },
          },
        });
      }
    }),
  uninvite: protectedProcedure
    .input(z.object({ projectId: z.string(), displayName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          id: input.projectId,
          invitations: {
            some: {
              user: {
                displayName: input.displayName,
              },
            },
          },
        },
        select: {
          owner: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      if (project.owner.id !== ctx.session.user.id) throw new TRPCError({ code: "UNAUTHORIZED" });

      await ctx.prisma.invitation.deleteMany({
        where: {
          projectId: input.projectId,
          user: {
            displayName: input.displayName,
          },
        },
      });
    }),
  invites: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.projectId },
        select: {
          owner: {
            select: {
              id: true,
            },
          },
          invitations: {
            select: {
              role: true,
              user: {
                select: {
                  displayName: true,
                },
              },
            },
            take: 20,
          },
        },
      });

      if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      if (project.owner.id !== ctx.session.user.id) throw new TRPCError({ code: "UNAUTHORIZED" });

      return project.invitations;
    }),
});
