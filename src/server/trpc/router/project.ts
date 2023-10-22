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
            take: 25,
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
          invitations: {
            select: {
              user: {
                select: {
                  displayName: true,
                },
              },
              role: true,
            },
          },
        },
      });

      if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      if (project.public && ctx.session?.user?.id === undefined)
        return { ...project, role: "VIEWER" };
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
    .input(
      z.object({
        name: z.string().min(1).max(35),
        public: z.boolean().default(true),
      })
    )
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
    .input(
      z.object({
        projectId: z.string(),
        documentName: z.string().min(1).max(35),
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
      if (project.owner.id !== ctx.session.user.id)
        throw new TRPCError({ code: "UNAUTHORIZED" });

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
  renameProject: protectedProcedure
    .input(
      z.object({ projectId: z.string(), newName: z.string().min(1).max(35) })
    )
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
      if (ctx.session.user.id !== project.owner.id)
        throw new TRPCError({ code: "UNAUTHORIZED" });

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
    .input(
      z.object({ projectId: z.string(), isEditable: z.boolean().default(true) })
    )
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
      if (ctx.session.user.id !== project.owner.id)
        throw new TRPCError({ code: "UNAUTHORIZED" });

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
    .input(
      z.object({ projectId: z.string(), isPublic: z.boolean().default(false) })
    )
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
      if (ctx.session.user.id !== project.owner.id)
        throw new TRPCError({ code: "UNAUTHORIZED" });

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
      z
        .object({
          projectId: z.string(),
          invitees: z.array(
            z.object({
              displayName: z.string(),
              role: z.enum(["VIEWER", "EDITOR", "NONE"]),
            })
          ),
        })
        .refine((z) => {
          const names = z.invitees.map((x) => x.displayName);
          return new Set(names).size === names.length;
        }, "Duplicate invitees")
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
          editors: {
            select: {
              displayName: true,
            },
          },
          viewers: {
            select: {
              displayName: true,
            },
          },
        },
      });
      if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      if (project.owner.id !== ctx.session.user.id)
        throw new TRPCError({ code: "UNAUTHORIZED" });

      const projectViewers = new Set(
        project.viewers.map((x) => x.displayName as string)
      );
      const projectEditors = new Set(
        project.editors.map((x) => x.displayName as string)
      );

      type Members = {
        displayName: string;
      }[];
      const existingViewerPromotions: Members = [];
      const existingEditorDemotions: Members = [];
      const newEditors: string[] = [];
      const newViewers: string[] = [];
      const existingMemberRemoval: Members = [];

      input.invitees.forEach((x) => {
        if (x.role === "VIEWER") {
          if (projectEditors.has(x.displayName))
            existingEditorDemotions.push({ displayName: x.displayName });
          else newViewers.push(x.displayName);
        } else if (x.role === "EDITOR") {
          if (projectViewers.has(x.displayName))
            existingViewerPromotions.push({ displayName: x.displayName });
          else newEditors.push(x.displayName);
        } else {
          if (
            projectViewers.has(x.displayName) ||
            projectEditors.has(x.displayName)
          )
            existingMemberRemoval.push({ displayName: x.displayName });
        }
      });
      const [newEditorIds, newViewerIds] = await ctx.prisma.$transaction([
        ctx.prisma.user.findMany({
          where: {
            displayName: {
              in: newEditors,
            },
          },
          select: {
            id: true,
          },
        }),
        ctx.prisma.user.findMany({
          where: {
            displayName: {
              in: newViewers,
            },
          },
          select: {
            id: true,
          },
        }),
      ]);

      /**
       * Connect existing project editors and viewers by displayName
       * Disconnect any promoted/demoted users (e.g. used to be viewer, now editor)
       *
       * Create invites for new editors/viewers
       */
      type Role = "EDITOR" | "VIEWER";
      await ctx.prisma.project.update({
        where: {
          id: input.projectId,
        },
        data: {
          editors: {
            connect: existingViewerPromotions,
            disconnect: [...existingEditorDemotions, ...existingMemberRemoval],
          },
          viewers: {
            connect: existingEditorDemotions,
            disconnect: [...existingViewerPromotions, ...existingMemberRemoval],
          },
          invitations: {
            upsert: [
              ...newEditorIds.map((user) => {
                return {
                  where: {
                    projectId_userId: {
                      userId: user.id,
                      projectId: input.projectId,
                    },
                  },
                  create: {
                    role: "EDITOR" as Role,
                    user: {
                      connect: {
                        id: user.id,
                      },
                    },
                  },
                  update: {
                    role: "EDITOR" as Role,
                  },
                };
              }),

              ...newViewerIds.map((user) => {
                return {
                  where: {
                    projectId_userId: {
                      userId: user.id,
                      projectId: input.projectId,
                    },
                  },
                  create: {
                    role: "VIEWER" as Role,
                    user: {
                      connect: {
                        id: user.id,
                      },
                    },
                  },
                  update: {
                    role: "VIEWER" as Role,
                  },
                };
              }),
            ],
          },
        },
      });
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
      if (project.owner.id !== ctx.session.user.id)
        throw new TRPCError({ code: "UNAUTHORIZED" });

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
      if (project.owner.id !== ctx.session.user.id)
        throw new TRPCError({ code: "UNAUTHORIZED" });

      return project.invitations;
    }),
});
