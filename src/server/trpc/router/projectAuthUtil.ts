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
  [x: string | number | symbol]: unknown;
}

export function isViewAuthorized(project: ProjectViewAuth, userId: string | undefined): boolean {
  if (project.public) return true;

  if ([...project.viewers, ...project.editors, project.owner].some((d) => d.id === userId))
    return true;

  return false;
}

interface ProjectEditAuth extends Pick<ProjectViewAuth, "editors" | "owner"> {
  [x: string | number | symbol]: unknown;
}
export function isEditAuthorized(project: ProjectEditAuth, userId: string | undefined): boolean {
  return [...project.editors, project.owner].some((d) => d.id === userId);
}

type Authority = "NONE" | "GUEST" | "VIEWER" | "EDITOR" | "OWNER";
export function getAuthority(project: ProjectViewAuth, userId: string | undefined): Authority {
  if (project.owner.id === userId) return "OWNER";
  if (project.editors.some((d) => d.id === userId)) return "EDITOR";
  if (project.viewers.some((d) => d.id === userId)) return "VIEWER";
  if (project.public) return "GUEST";
  return "NONE";
}
