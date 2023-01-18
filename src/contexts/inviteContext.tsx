import React from "react";

const INVITABLE_ROLES = ["VIEWER", "EDITOR"];
type InvitableRole = "VIEWER" | "EDITOR";

type ActionType = "ADD" | "REMOVE" | "UPDATE" | "CLEAR";
type InviteAction = {
  type: ActionType;
  payload?: { displayName: string; role?: InvitableRole };
};

export type InviteState = {
  [displayName: string]: InvitableRole;
};

type InviteContext = {
  state: InviteState;
  dispatch: React.Dispatch<InviteAction>;
};

const InviteContext = React.createContext<InviteContext>({ state: {}, dispatch: () => 0 });

function inviteReducer(state: InviteState, action: InviteAction) {
  let newState: InviteState = {};
  switch (action.type) {
    case "ADD":
      newState = { ...state };
      if (
        typeof action.payload?.displayName !== "string" ||
        typeof action.payload?.role !== "string" ||
        !INVITABLE_ROLES.includes(action.payload.role)
      ) {
        throw new Error("Add action requires displayName and role.");
      }
      newState[action.payload?.displayName] = action.payload?.role as InvitableRole;
      break;
    case "REMOVE":
      if (typeof action.payload?.displayName !== "string") {
        throw new Error("Remove action requires displayName");
      }
      newState = { ...state };
      delete newState[action.payload.displayName];
      break;
    case "UPDATE":
      newState = { ...state };
      if (
        typeof action.payload?.displayName !== "string" ||
        typeof action.payload?.role !== "string" ||
        !INVITABLE_ROLES.includes(action.payload.role)
      ) {
        throw new Error("Update action requires displayName and role.");
      }
      newState[action.payload?.displayName] = action.payload?.role as InvitableRole;
      break;
    case "CLEAR":
      newState = {};
      break;
  }
  return newState;
}
function InviteProvider({ children }: React.PropsWithChildren) {
  const [state, dispatch] = React.useReducer(inviteReducer, {} as InviteState);
  return <InviteContext.Provider value={{ state, dispatch }}>{children}</InviteContext.Provider>;
}

function useInvites() {
  const context = React.useContext(InviteContext);
  return context;
}

export { InviteProvider, useInvites };
