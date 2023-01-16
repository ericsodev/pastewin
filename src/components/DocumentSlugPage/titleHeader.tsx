import Link from "next/link";
import type { RouterOutputs } from "../../utils/trpc";
import { TitleInput } from "./titleInput";

interface Props {
  document: RouterOutputs["document"]["getDocument"];
  refetch: () => void;
}
export function TitleHeader({ document, refetch }: Props): JSX.Element {
  const project = document.project;

  return (
    <div>
      <div className="flex flex-row items-baseline gap-3">
        {project ? (
          <TitleInput refetch={refetch} document={document}></TitleInput>
        ) : (
          <h1 className="text-4xl font-semibold text-slate-800 dark:text-slate-100">
            {document.name}{" "}
          </h1>
        )}
        {project && (
          <span className="text-2xl font-normal text-slate-400">
            {" "}
            by{" "}
            <Link href={`/account/public/${project.owner.displayName}`} className="font-medium">
              {project.owner.displayName}
            </Link>
          </span>
        )}
      </div>
      {project && (
        <h2 className="mb-4 text-lg text-slate-600 dark:text-slate-400">
          from
          <Link
            href={`/project/${project.slug}`}
            className="font-medium text-slate-700 dark:text-slate-300"
          >
            {" "}
            {project.name}
          </Link>
        </h2>
      )}
    </div>
  );
}
