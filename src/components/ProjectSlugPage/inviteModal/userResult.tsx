import { UserPlusIcon } from "@heroicons/react/24/solid";
import type { RouterOutputs } from "../../../utils/trpc";
import { RoleBadge } from "./roleBadge";

type Project = Pick<RouterOutputs["project"]["overview"], "id" | "editors" | "viewers" | "owner">;
type Role = "NONE" | "VIEWER" | "EDITOR" | "OWNER";

interface Props {
  displayName: string;
  project: Project;
}

export function UserResult({ displayName, project }: Props): JSX.Element {
  const role = getRole(displayName, project);
  return (
    <div
      key={displayName}
      className="flex flex-row items-center justify-between rounded-md bg-slate-50 py-2 px-3"
    >
      <h1 className="font-medium text-slate-600">{displayName}</h1>
      <div className="flex items-stretch gap-2">
        <RoleBadge role={getRole(displayName, project)}></RoleBadge>
        <button
          className="rounded-lg bg-emerald-200 py-1 px-3 text-green-800 disabled:bg-emerald-700/10 disabled:text-green-700/60"
          disabled={role === "OWNER"}
        >
          <UserPlusIcon className="inline-block h-4 w-4 "></UserPlusIcon>
          <text className="ml-2 text-sm font-medium">invite</text>
        </button>
      </div>
    </div>
  );
}

function getRole(displayName: string | null, project: Project): Role {
  if (!displayName) return "NONE";
  if (displayName === project.owner.displayName) return "OWNER";
  if (project.editors.some((v) => v.displayName === displayName)) return "EDITOR";
  if (project.viewers.some((v) => v.displayName === displayName)) return "VIEWER";
  return "NONE";
}
