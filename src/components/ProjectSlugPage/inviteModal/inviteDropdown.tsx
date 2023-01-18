import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const SelectableRoles = ["VIEWER", "EDITOR"];
type SelectableRole = typeof SelectableRoles[number];
type Role = "NONE" | "VIEWER" | "EDITOR" | "OWNER";

interface Props {
  currentRole: Role;
}

export function InviteDropdown({ currentRole }: Props): JSX.Element {
  const [selectedRole, setSelectedRole] = useState<Role>(currentRole);
  return (
    <div className="relative">
      <Listbox value={selectedRole} onChange={setSelectedRole}>
        <Listbox.Button className="relative flex w-28 items-center justify-between rounded-md bg-slate-200 px-3 py-1 text-slate-700">
          <span>{selectedRole.toLowerCase()}</span>
          <span>
            <ChevronUpDownIcon className="h-5 w-5"></ChevronUpDownIcon>
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute z-10 mt-1 w-full overflow-clip rounded-md bg-slate-100 py-1 shadow-lg ring-1 ring-black ring-opacity-10">
          {SelectableRoles.map((role: SelectableRole) => (
            <Listbox.Option
              key={role}
              value={role}
              disabled={currentRole === role || currentRole === "OWNER"}
              className="flex cursor-default   bg-slate-50 px-2 py-1.5  text-sm text-slate-800 hover:bg-violet-200/80 hover:text-violet-800"
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
