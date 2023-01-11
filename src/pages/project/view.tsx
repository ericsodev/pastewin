import type { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { Loading } from "../../components/loading";
import { Error } from "../../components/error";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

const gridSizingClasses =
  "lg:grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] 2xl:grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] 4xl:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]";

const ViewProjectPage: NextPage = (req, res) => {
  useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });
  const { data: projects, isLoading, isError } = trpc.user.getAllProjects.useQuery();

  if (isError) return <Error></Error>;
  if (isLoading) return <Loading></Loading>;
  return (
    <div className="px-12 py-12 xl:px-24 2xl:px-36">
      <div className={`grid gap-4 ${gridSizingClasses}`}>
        {projects.ownedProjects.map((v) => (
          <Link href={`/project/${v.slug}`} key={v.id}>
            <div
              tabIndex={0}
              className="cursor-pointer overflow-hidden rounded-md border-[2px] border-white/50 bg-gradient-to-br from-white/40 to-white/10 px-8 pt-6 pb-8 hover:border-white/30 hover:from-white/30 dark:border-gray-800 dark:from-gray-900 dark:to-gray-800/50 dark:hover:border-violet-500/40"
            >
              <h2 className="mb-5 max-w-[90%] truncate text-ellipsis text-xl font-semibold text-slate-700 dark:text-slate-300">
                {v.name}
              </h2>

              <p className="max-w-xs text-slate-600 dark:text-slate-400">
                created by <strong className="font-semibold">{v.owner.displayName}</strong>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ViewProjectPage;
