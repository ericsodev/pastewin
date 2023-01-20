import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { RouterOutputs } from "../../../utils/trpc";
import { UserResult } from "./userResult";

type Project = Pick<
  RouterOutputs["project"]["overview"],
  "id" | "editors" | "viewers" | "owner" | "invitations"
>;

interface Props {
  searchResults: {
    displayName: string | null;
  }[];
  project: Project;
}
export function UserSearchResult({ searchResults, project }: Props): JSX.Element {
  const [parent] = useAutoAnimate<HTMLDivElement>({ duration: 100 });
  return (
    <div className="mt-2 flex flex-col gap-2" ref={parent}>
      {searchResults.map((user) => (
        <UserResult
          key={user.displayName}
          displayName={user.displayName as string}
          project={project}
        ></UserResult>
      ))}
    </div>
  );
}
