import { Listbox } from "@headlessui/react";
import { useState } from "react";

const SelectableRoles = ["VIEWER", "EDITOR"];
type SelectableRole = typeof SelectableRoles[number];
type Role = "NONE" | "VIEWER" | "EDITOR" | "OWNER";

interface Props {
  currentRole: Role;
}

export function InviteDropdown({ currentRole }: Props): JSX.Element {
  const [selectedRole, setSelectedRole] = useState<Role>("EDITOR");
  return (
    <Listbox value={selectedRole} onChange={setSelectedRole}>
      <Listbox.Button>{selectedRole}</Listbox.Button>
      <Listbox.Options>
        {SelectableRoles.map((role: SelectableRole) => (
          <Listbox.Option
            key={role}
            value={role}
            disabled={currentRole === role || currentRole === "OWNER"}
          >
            {role}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
}
