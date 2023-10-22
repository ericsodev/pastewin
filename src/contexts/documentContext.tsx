import type { RouterOutputs } from "../utils/trpc";
import React from "react";
type Document = RouterOutputs["document"]["getDocument"];
interface DocumentContext {
  document?: Document;
  refetch: () => void;
}
const DocumentContext = React.createContext<DocumentContext>({
  document: undefined,
  refetch: () => {
    return;
  },
});

interface Props extends React.PropsWithChildren {
  document: Document;
  refetch: () => void;
}
function DocumentProvider({ children, document, refetch }: Props): JSX.Element {
  // fetch the document

  return (
    <DocumentContext.Provider value={{ document, refetch }}>
      {children}
    </DocumentContext.Provider>
  );
}

function useDocument() {
  const context = React.useContext(DocumentContext);
  return context;
}

export { DocumentProvider, useDocument };
