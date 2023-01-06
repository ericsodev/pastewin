import { router } from "../trpc";
import { authRouter } from "./auth";
import { documentRouter } from "./document";
import { projectRouter } from "./project";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  project: projectRouter,
  document: documentRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
