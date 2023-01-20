import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { InviteToast } from "../InviteToast";
import { RegisterModal } from "../NewAccountModal";
import AccountMenu from "./accountMenu";
import SettingsMenu from "./settingsMenu";

export default function Navbar(): JSX.Element {
  const { data: session, status } = useSession();
  const [isRegisterModalOpen, setModalOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && !session.user?.displayName) {
      setModalOpen(true);
    }
  }, [status, session, router, setModalOpen]);
  return (
    <div
      className={
        "flex w-full items-center justify-center gap-5 bg-gradient-to-b from-slate-400/40 to-transparent px-5 pt-3.5 pb-8 backdrop-blur-xl dark:from-slate-900/70 dark:to-transparent"
      }
    >
      <InviteToast></InviteToast>
      <RegisterModal open={isRegisterModalOpen} setOpen={setModalOpen}></RegisterModal>
      <Link
        href="/"
        className={
          "mr-auto h-fit text-xl font-bold text-slate-700/90 transition-colors hover:text-slate-900 dark:text-indigo-300 dark:hover:text-indigo-300/80 dark:focus:text-indigo-200"
        }
      >
        pastewin
      </Link>
      <div className="flex flex-row gap-3">
        <Link
          className="border-b-2 border-solid border-b-transparent px-3.5 py-2 font-semibold text-slate-700 transition-all hover:border-slate-300 hover:border-b-slate-400 focus:border-slate-200 focus:border-b-slate-700 dark:text-slate-100"
          href="/explore"
        >
          explore
        </Link>
        {status === "authenticated" && (
          <>
            <Link
              href="/project/view"
              className="border-b-2 border-solid border-b-transparent px-3.5 py-2 font-semibold text-slate-700 transition-all hover:border-slate-300 hover:border-b-slate-400 focus:border-slate-200 focus:border-b-slate-700 dark:text-slate-100"
            >
              your projects
            </Link>
            <Link
              className="border-b-2 border-solid border-b-transparent px-3.5 py-2 font-semibold text-slate-700 transition-all hover:border-slate-300 hover:border-b-slate-400 focus:border-slate-200 focus:border-b-slate-700 dark:text-slate-100"
              href="/project/create"
            >
              create
            </Link>
          </>
        )}
      </div>
      <span className="ml-auto"></span>
      <AccountMenu></AccountMenu>
      <SettingsMenu></SettingsMenu>
    </div>
  );
}
