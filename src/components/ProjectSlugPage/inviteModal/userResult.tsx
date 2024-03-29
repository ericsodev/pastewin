import { CheckIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { useInvites } from "../../../contexts/inviteContext";
import type { RouterOutputs } from "../../../utils/trpc";
import { RoleBadge } from "./roleBadge";

type Project = Pick<
  RouterOutputs["project"]["overview"],
  "id" | "editors" | "viewers" | "owner" | "invitations"
>;
type Role = "NONE" | "VIEWER" | "EDITOR" | "OWNER" | "INVITED";

interface Props {
  displayName: string;
  project: Project;
}

export function UserResult({ displayName, project }: Props): JSX.Element {
  const { state: invites, dispatch: dispatchInvite } = useInvites();
  const role = getRole(displayName, project);
  return (
    <div
      key={displayName}
      className="flex flex-row items-center justify-between rounded-md bg-slate-50 py-1.5 pl-5 pr-3 dark:bg-ch-gray-700"
    >
      <h1 className="font-medium text-slate-600 dark:text-gray-300">{displayName}</h1>
      <div className="flex items-stretch gap-2">
        <RoleBadge role={role}></RoleBadge>
        <button
          onClick={() => {
            dispatchInvite({ type: "ADD", payload: { displayName: displayName, role: "VIEWER" } });
          }}
          className="flex w-24 items-center justify-start rounded-lg bg-emerald-200 py-1 px-3 text-green-800 disabled:bg-emerald-700/10 disabled:text-green-700/60 dark:disabled:bg-emerald-700/50 dark:disabled:text-green-600"
          disabled={role === "OWNER" || displayName in invites}
        >
          {displayName in invites ? (
            <>
              <CheckIcon className="inline-block h-4 w-4 "></CheckIcon>
              <text className="ml-2 text-sm font-medium">added</text>
            </>
          ) : (
            <>
              <UserPlusIcon className="inline-block h-4 w-4 "></UserPlusIcon>
              <text className="ml-2 text-sm font-medium">
                {role === "NONE" ? "invite" : "edit"}
              </text>
            </>
          )}
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
  if (project.invitations.some((v) => v.user.displayName === displayName)) return "INVITED";
  return "NONE";
}
