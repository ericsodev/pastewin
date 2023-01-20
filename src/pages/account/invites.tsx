import dayjs from "dayjs";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { Error } from "../../components/error";
import { trpc } from "../../utils/trpc";

const gridSizingClasses =
  "lg:grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] 2xl:grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] 4xl:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]";

const AccountPage: NextPage = (req, res) => {
  const { status } = useSession();
  const acceptInvite = trpc.user.acceptInvite.useMutation();
  const declineInvite = trpc.user.deleteInvite.useMutation();
  const {
    data: invites,
    isLoading,
    isError,
    refetch,
  } = trpc.user.getInvites.useQuery(undefined, {
    enabled: status === "authenticated",
  });
  if (status === "loading" || isLoading) return <div></div>;
  if (status === "unauthenticated") return <div>pls sign in</div>;
  if (isError) return <Error></Error>;
  return (
    <div className="flex flex-col gap-8 p-16 xl:px-36 2xl:px-48">
      <Head>
        <title>Invites | PasteWin</title>
      </Head>
      <div className="flex h-max flex-row items-end gap-2">
        <h1 className="max-w-[24ch] truncate text-4xl font-semibold text-slate-800 dark:text-slate-100">
          Invites
        </h1>
      </div>
      <div className={`${gridSizingClasses} grid`}>
        {invites.length === 0 && (
          <div className="flex h-full cursor-pointer flex-col gap-8 rounded-md border-[2px] border-white/50 bg-gradient-to-br from-white/40 to-white/10 px-8 py-6 shadow-xl shadow-black/5 hover:border-white/30 hover:from-white/30 dark:border-gray-800 dark:from-gray-900 dark:to-gray-800/50 dark:shadow-slate-800/10 dark:hover:border-violet-500/40">
            <h2 className="text-center text-lg font-medium text-slate-700 dark:text-slate-300">
              no invites
            </h2>
          </div>
        )}
        {invites.map((invite) => (
          <div
            key={invite.projectId + invite.userId}
            tabIndex={0}
            className="flex h-full cursor-pointer flex-col gap-8 rounded-md border-[2px] border-white/50 bg-gradient-to-br from-white/40 to-white/10 px-8 py-6 shadow-xl shadow-black/5 hover:border-white/30 hover:from-white/30 dark:border-gray-800 dark:from-gray-900 dark:to-gray-800/50 dark:shadow-slate-800/10 dark:hover:border-violet-500/40"
          >
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
              {invite.project.name}
              <h3 className="mt-2 text-base font-medium text-slate-600 dark:text-slate-400">
                editor
              </h3>
            </h2>

            <div className="flex flex-col gap-2">
              <p className="mt-auto max-w-xs text-slate-600 dark:text-slate-400">
                invited by{" "}
                <strong className="font-semibold">{invite.project.owner.displayName}</strong>
              </p>
              <div className="divide-x-2 divide-green-600 self-start">
                <button
                  onClick={async () => {
                    await acceptInvite.mutateAsync({ projectId: invite.projectId });
                    refetch();
                  }}
                  className="rounded-l bg-green-300 px-3 py-1 text-green-800 transition-colors hover:bg-green-400/90"
                >
                  accept
                </button>
                <button
                  onClick={async () => {
                    await declineInvite.mutateAsync({ projectId: invite.projectId });
                    refetch();
                  }}
                  className="rounded-r bg-yellow-200 px-3 py-1 text-yellow-800 transition-colors hover:bg-yellow-300 focus:bg-yellow-300/90"
                >
                  decline
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AccountPage;
