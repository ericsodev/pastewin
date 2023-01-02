export default function Page(): JSX.Element {
  return (
    <div className="flex w-full flex-grow items-center justify-center">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] items-center gap-8">
        <div className="rounded-md border-[2px] border-white/50 bg-gradient-to-br from-white/40 to-white/10 px-8 py-6 hover:border-slate-500/60 dark:border-gray-800 dark:from-gray-900 dark:to-gray-800/50 dark:hover:border-violet-500/40">
          <h2 className="mb-4 text-2xl font-semibold text-slate-700 dark:text-slate-300">
            Documents
          </h2>
          <p className="max-w-xs text-slate-600 dark:text-slate-400">
            Explore public snippets made by other users.
          </p>
        </div>
        <div className="rounded-md border-[2px] border-white/50 bg-gradient-to-br from-white/40 to-white/10 px-8 py-6 hover:border-slate-500/60 dark:border-gray-800 dark:from-gray-900 dark:to-gray-800/50 dark:hover:border-violet-500/40">
          <h2 className="mb-4 text-2xl font-semibold text-slate-700 dark:text-slate-300">
            Projects
          </h2>

          <p className="max-w-xs text-slate-600 dark:text-slate-400">
            Explore public projects made by other users.
          </p>
        </div>
      </div>
    </div>
  );
}
