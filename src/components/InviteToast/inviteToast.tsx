import { InboxIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { trpc } from "../../utils/trpc";

export function InviteToast(): JSX.Element {
  const { status } = useSession();
  const router = useRouter();
  const { data: invites } = trpc.user.getInvites.useQuery(undefined, {
    enabled: status === "authenticated",
    retry: 0,
    refetchInterval: 1000 * 60 * 10,
  });
  const { Toast, showToast, closeToast } = useToast({
    timeOpen: 100,
    position: "tr",
  });
  useEffect(() => {
    if (!invites || invites.length === 0) return;
    showToast();
  }, [invites]);

  if (!invites) return <></>;
  return (
    <Toast>
      <div className="flex items-center overflow-clip rounded-md bg-slate-200/60 shadow-md backdrop-blur-lg">
        <span className="flex items-center gap-2 px-4 py-2">
          <InboxIcon className="h-5 w-5"></InboxIcon>
          <span
            onClick={() => {
              closeToast();
              router.push("/account/invites");
            }}
          >
            view {invites.length} invites
          </span>
        </span>
        <span className="w-[1px] self-stretch bg-slate-400"></span>
        <span
          className="flex items-center justify-center self-stretch p-2 hover:bg-slate-200"
          onClick={closeToast}
        >
          <XMarkIcon className="h-5 w-5"></XMarkIcon>
        </span>
      </div>
    </Toast>
  );
}
