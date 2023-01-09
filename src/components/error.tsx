import Link from "next/link";

export function Error(props: React.PropsWithChildren): JSX.Element {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex flex-col items-start gap-6">
        <h1 className="text-xl font-medium text-slate-700 dark:text-purple-100">
          {props.children || "An unexpected error occurred."}
        </h1>
        <Link
          className="rounded-md bg-slate-50 py-2 px-4 font-medium text-slate-600 dark:bg-purple-200/90 dark:text-purple-900"
          href="/"
        >
          back to safety
        </Link>
      </div>
    </div>
  );
}
