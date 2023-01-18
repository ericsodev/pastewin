type Role = "NONE" | "VIEWER" | "EDITOR" | "OWNER";
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
    default:
      break;
  }
  if (role === "NONE") return <></>;
  return (
    <span className={`flex items-center rounded-lg px-2 py-0.5 text-sm ${colorClasses}`}>
      {role.toLowerCase()}
    </span>
  );
}