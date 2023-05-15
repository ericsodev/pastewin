import type { RouterOutputs } from "../utils/trpc";
import React from "react";
type Revision = RouterOutputs["document"]["getRevision"];
interface RevisionContext {
  revision?: Revision;
  refetch: () => void;
}
const RevisionContext = React.createContext<RevisionContext>({
  revision: undefined,
  refetch: () => {
    return;
  },
});

interface Props extends React.PropsWithChildren {
  revision: Revision;
  refetch: () => void;
}
function RevisionProvider({ children, revision, refetch }: Props): JSX.Element {
  // fetch the document

  return (
    <RevisionContext.Provider value={{ revision, refetch }}>
      {children}
    </RevisionContext.Provider>
  );
}

function useRevision() {
  const context = React.useContext(RevisionContext);
  return context;
}

export { RevisionProvider, useRevision };
