type Role = "INVITED" | "NONE" | "VIEWER" | "EDITOR" | "OWNER";
interface Props {
  role: Role;
}
export function RoleBadge({ role }: Props) {
  let colorClasses = "";
  switch (role) {
    case "VIEWER":
      colorClasses = "bg-orange-100 text-orange-600";
      break;
    case "EDITOR":
      colorClasses = "bg-orange-100 text-orange-600";
      break;
    case "OWNER":
      colorClasses = "bg-violet-100 text-violet-600";
      break;
    case "INVITED":
      colorClasses = "bg-slate-200 text-slate-600";
    default:
      break;
  }
  if (role === "NONE") return <></>;
  return (
    <span
      className={`flex w-20 items-center justify-center rounded-lg px-2 py-0.5 text-sm ${colorClasses}`}
    >
      {role.toLowerCase()}
    </span>
  );
}
