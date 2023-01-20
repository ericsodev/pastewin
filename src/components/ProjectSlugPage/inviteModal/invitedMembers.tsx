import { XMarkIcon } from "@heroicons/react/20/solid";
import { useInvites } from "../../../contexts/inviteContext";
import { InviteDropdown } from "./inviteDropdown";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export function InvitedMembers(): JSX.Element {
  const { state: invites, dispatch } = useInvites();
  const [parent] = useAutoAnimate<HTMLDivElement>({ duration: 100 });

  return (
    <div>
      <h1 className="mb-2 font-medium text-slate-600">Selected Users</h1>
      <div className="flex max-h-48 flex-col gap-2" ref={parent}>
        {Object.keys(invites).length === 0 && (
          <span className="self-center text-slate-600">no selected users</span>
        )}
        {Object.entries(invites).map(([displayName, role]) => (
          <div
            key={displayName}
            className="flex flex-row items-center justify-between rounded-md bg-slate-50 py-1.5 px-6 pr-3"
          >
            <h1 className="font-medium text-slate-600">{displayName}</h1>
            <div className="flex items-center gap-2">
              <InviteDropdown displayName={displayName} currentRole={role}></InviteDropdown>
              <XMarkIcon
                onClick={() => {
                  dispatch({
                    type: "REMOVE",
                    payload: {
                      displayName: displayName,
                    },
                  });
                }}
                className="h-5 w-5 text-slate-500 hover:scale-125   hover:text-red-400"
              ></XMarkIcon>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
