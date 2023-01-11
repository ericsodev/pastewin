import z from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
  getPublicProfile: publicProcedure
    .input(
      z
        .object({ displayName: z.string(), userId: z.string() })
        .partial()
        .refine((d) => !!d.displayName || !!d.userId)
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          displayName: input.displayName,
          id: input.userId,
        },
        select: {
          displayName: true,
          image: true,
          ownedProjects: {
            where: {
              public: { equals: true },
            },
            select: {
              id: true,
              name: true,
              slug: true,
              _count: {
                select: {
                  documents: true,
                },
              },
            },
          },
          editableProjects: {
            where: {
              public: { equals: true },
            },
            select: {
              id: true,
              name: true,
              slug: true,
              _count: {
                select: {
                  documents: true,
                },
              },
              owner: {
                select: {
                  displayName: true,
                },
              },
            },
          },
        },
      });
      if (user === null) throw new TRPCError({ code: "NOT_FOUND" });
      return user;
    }),
  getViewableProjects: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        viewableProjects: {
          orderBy: { name: "asc" },
        },
      },
    });
    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    return user.viewableProjects;
  }),
  getEditableProjects: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        editableProjects: {
          orderBy: { name: "asc" },
        },
      },
    });
    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    return user.editableProjects;
  }),
  getOwnedProjects: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        ownedProjects: {
          orderBy: { name: "asc" },
        },
      },
    });
    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    return user.ownedProjects;
  }),
  getAllProjects: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        ownedProjects: {
          select: {
            id: true,
            name: true,
            slug: true,
            owner: {
              select: {
                displayName: true,
              },
            },
          },
        },
        editableProjects: {
          select: {
            id: true,
            name: true,
            slug: true,
            owner: {
              select: {
                displayName: true,
              },
            },
          },
        },
        viewableProjects: {
          select: {
            id: true,
            name: true,
            slug: true,
            owner: {
              select: {
                displayName: true,
              },
            },
          },
        },
      },
    });
    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });
    return user;
  }),
  getInvites: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session.user.id !== input.userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          invitations: {
            select: {
              projectId: true,
              userId: true,
              role: true,
              project: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (user === null) throw new TRPCError({ code: "NOT_FOUND" });

      return user.invitations;
    }),
  changeName: protectedProcedure
    .input(z.string().min(1).max(20).trim())
    .mutation(async ({ ctx, input: newName }) => {
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          displayName: newName,
        },
      });
    }),
  acceptInvite: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const invite = await ctx.prisma.invitation.findUnique({
        where: {
          projectId_userId: {
            projectId: input.projectId,
            userId: ctx.session.user.id,
          },
        },
        select: {
          role: true,
          projectId: true,
        },
      });
      if (invite === null) throw new TRPCError({ code: "NOT_FOUND" });

      // This returns an error since role === "OWNER", and you cannot invite another as an owner.
      if (invite.role === "OWNER") throw new TRPCError({ code: "BAD_REQUEST" });

      let data: any;

      if (invite.role === "VIEWER") {
        data = {
          viewer: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        };
      } else {
        // EDITOR
        data = {
          editor: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        };
      }

      const project = await ctx.prisma.project.update({
        where: { id: invite.projectId },
        data: data,
        select: {
          id: true,
          name: true,
          slug: true,
        },
      });
      await ctx.prisma.invitation.delete({
        where: {
          projectId_userId: {
            projectId: input.projectId,
            userId: ctx.session.user.id,
          },
        },
      });
      return project;
    }),
  deleteInvite: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const invite = await ctx.prisma.invitation.delete({
        where: {
          projectId_userId: {
            projectId: input.projectId,
            userId: ctx.session.user.id,
          },
        },
        select: {
          role: true,
          project: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });
      if (invite === null) throw new TRPCError({ code: "NOT_FOUND" });

      return invite;
    }),
  nameTaken: protectedProcedure
    .input(z.string().min(1).max(20))
    .query(async ({ ctx, input: name }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          displayName: name,
        },
      });
      return !!user;
    }),
});
