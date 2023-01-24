import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useInvites } from "../../../contexts/inviteContext";

const SelectableRoles = ["VIEWER", "EDITOR"];
type SelectableRole = typeof SelectableRoles[number];
type Role = "NONE" | "VIEWER" | "EDITOR" | "OWNER";
type InvitableRole = "VIEWER" | "EDITOR";

interface Props {
  currentRole: InvitableRole;
  displayName: string;
}

export function InviteDropdown({ displayName, currentRole }: Props): JSX.Element {
  const { dispatch: dispatchInvite } = useInvites();
  const [selectedRole, setSelectedRole] = useState<InvitableRole>(currentRole);
  useEffect(() => {
    dispatchInvite({ type: "UPDATE", payload: { displayName: displayName, role: selectedRole } });
  }, [selectedRole, dispatchInvite, displayName]);
  return (
    <div className="relative">
      <Listbox value={selectedRole} onChange={setSelectedRole}>
        <Listbox.Button className="relative flex w-28 items-center justify-between rounded-md bg-slate-200 px-3 py-1 text-slate-700 dark:bg-ch-gray-600 dark:text-gray-300">
          <span>{selectedRole.toLowerCase()}</span>
          <span>
            <ChevronUpDownIcon className="h-5 w-5"></ChevronUpDownIcon>
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute z-10 mt-1 w-full overflow-clip rounded-md bg-slate-100 py-1 shadow-lg ring-1 ring-black ring-opacity-10 dark:bg-ch-gray-800">
          {SelectableRoles.map((role: SelectableRole) => (
            <Listbox.Option
              key={role}
              value={role}
              disabled={currentRole === role}
              className="cursor-defaul flex px-2 py-1.5 text-sm text-slate-800  hover:bg-violet-200/80 hover:text-violet-800 dark:text-gray-300 dark:hover:text-violet-500"
            >
              {({ selected }) => (
                <>
                  <span>
                    {" "}
                    <CheckIcon className="mr-2 h-5 w-5" opacity={selected ? 100 : 0}></CheckIcon>
                  </span>
                  <span>{role.toLowerCase()}</span>
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}
