interface ProjectViewAuth {
  public: boolean;
  viewers: {
    id: string;
    [x: string | number | symbol]: unknown;
  }[];
  editors: {
    id: string;
    [x: string | number | symbol]: unknown;
  }[];
  owner: {
    id: string;
    [x: string | number | symbol]: unknown;
  };
  revisions: Document;
  [x: string | number | symbol]: unknown;
}

interface Document {
  id: string;
  [x: string | number | symbol]: unknown;
}

export function isEditableDocument() {
  return;
}
