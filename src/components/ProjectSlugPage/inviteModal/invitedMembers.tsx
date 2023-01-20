import { useInvites } from "../../../contexts/inviteContext";
import { InviteDropdown } from "./inviteDropdown";

export function InvitedMembers(): JSX.Element {
  const { state: invites } = useInvites();
  return (
    <div>
      <h1 className="mb-2 font-medium text-slate-600">Selected Users</h1>
      <div className="flex max-h-48 flex-col gap-2">
        {Object.keys(invites).length === 0 && (
          <span className="self-center text-slate-600">no selected users</span>
        )}
        {Object.entries(invites).map(([displayName, role]) => (
          <div
            key={displayName}
            className="flex flex-row items-center justify-between rounded-md bg-slate-50 py-1.5 px-6 pr-3"
          >
            <h1 className="font-medium text-slate-600">{displayName}</h1>
            <div>
              <InviteDropdown displayName={displayName} currentRole={role}></InviteDropdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
