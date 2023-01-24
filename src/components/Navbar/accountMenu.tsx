import { Menu } from "@headlessui/react";
import { ArrowLeftCircleIcon, InboxIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function AccountMenu(): JSX.Element {
  const { data: session, status } = useSession();

  if (status === "loading") return <></>;
  if (status === "unauthenticated" || !session)
    return (
      <button
        onClick={() => signIn()}
        className="text-md rounded-md border-solid bg-slate-50/80 py-1 px-4 font-medium text-slate-600 backdrop-blur-2xl transition-all hover:bg-slate-50/60 focus:bg-slate-50/90 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-800/80 dark:focus:bg-slate-700/80"
      >
        Sign in
      </button>
    );

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="rounded-md border-solid border-white">
        {!!session.user?.image ? (
          <Image
            className="h-10 w-10 self-center rounded-full border-2 border-solid border-purple-50 hover:scale-105 hover:drop-shadow-lg dark:border-purple-200"
            width="100"
            height="100"
            src={session.user?.image ?? "/"}
            alt="account image"
          ></Image>
        ) : (
          <UserCircleIcon className="h-10 w-10 rounded-full bg-violet-400/40 text-slate-100 ring-4 ring-violet-200/80 ring-offset-[-2px]"></UserCircleIcon>
        )}
      </Menu.Button>
      <Menu.Items className="absolute right-0 min-w-fit origin-top-right divide-y-2 divide-gray-300 rounded-md bg-slate-50/60 px-1 py-0.5 text-sm text-slate-600 shadow-md backdrop-blur-2xl dark:divide-gray-700 dark:border-2 dark:border-gray-800 dark:bg-slate-800/30 dark:text-slate-300">
        <div className="px-0.5 py-1">
          <Menu.Item>
            <Link
              href={`/account`}
              className="inline-flex w-full items-center justify-start gap-3 rounded-md p-2 hover:bg-slate-400/30 hover:bg-opacity-70 dark:hover:bg-slate-700"
            >
              <UserCircleIcon className="h-5 w-5"></UserCircleIcon>
              Account
            </Link>
          </Menu.Item>
        </div>
        <div className="w-full px-0.5 py-1">
          <Menu.Item>
            <Link
              href={"/account/invites"}
              className="inline-flex w-full items-center justify-start gap-3 rounded-md p-2 hover:bg-slate-400/30 hover:bg-opacity-70 dark:hover:bg-slate-700"
            >
              <InboxIcon className="h-5 w-5"></InboxIcon>
              Invitations
            </Link>
          </Menu.Item>
        </div>
        <div className="w-full px-0.5 py-1">
          <Menu.Item>
            <button
              onClick={() => signOut()}
              className="hover:bg-opacity-700 inline-flex w-full items-center justify-start gap-3 rounded-md p-2 hover:bg-slate-400/30 dark:hover:bg-slate-700"
            >
              <ArrowLeftCircleIcon className="h-5 w-5"></ArrowLeftCircleIcon>
              Logout
            </button>
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}
