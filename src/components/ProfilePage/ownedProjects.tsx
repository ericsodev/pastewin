import { gridSizingClasses } from "./styles";
import type { RouterOutputs } from "../../utils/trpc";
import Link from "next/link";

interface Props {
  ownedProjects: RouterOutputs["user"]["getPublicProfile"]["ownedProjects"];
}
export function OwnedProjectCards({ ownedProjects }: Props): JSX.Element {
  if (ownedProjects.length === 0)
    return (
      <div
        tabIndex={0}
        className="flex w-fit cursor-pointer items-center justify-center overflow-hidden rounded-md border-[2px] border-white/50 bg-gradient-to-br from-white/40 to-white/10 px-6 py-4 hover:border-white/30 hover:from-white/30 dark:border-gray-800 dark:from-gray-900 dark:to-gray-800/50 dark:hover:border-violet-500/40"
      >
        <h2 className="text-base font-medium text-slate-700 dark:text-slate-300">
          there&apos;s nothing here.
        </h2>
      </div>
    );

  return (
    <div className={`grid gap-4 ${gridSizingClasses}`}>
      {ownedProjects.map((v) => (
        <Link href={`/project/${v.slug}`} key={v.id}>
          <div
            tabIndex={0}
            className="cursor-pointer overflow-hidden rounded-md border-[2px] border-white/50 bg-gradient-to-br from-white/40 to-white/10 px-8 pt-6 pb-8 hover:border-white/30 hover:from-white/30 dark:border-gray-800 dark:from-gray-900 dark:to-gray-800/50 dark:hover:border-violet-500/40"
          >
            <h2 className="mb-5 max-w-[90%] truncate text-ellipsis text-xl font-semibold text-slate-700 dark:text-slate-300">
              {v.name}
            </h2>

            <p className="max-w-xs text-slate-600 dark:text-slate-400">
              <strong className="font-semibold">{v._count.documents}</strong> document
              {v._count.documents === 1 ? "" : "s"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
