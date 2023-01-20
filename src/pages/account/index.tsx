import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { Error } from "../../components/error";
import { Loading } from "../../components/loading";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { Disclosure } from "@headlessui/react";
import { OwnedProjectCards } from "../../components/ProfilePage/ownedProjects";
import { EditableProjectCards } from "../../components/ProfilePage/editableProjects";

const AccountPage: NextPage = (req, res) => {
  const { data: session, status: sessionStatus } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });
  const {
    data: profile,
    isLoading: accountLoading,
    isError: accountError,
  } = trpc.user.getAllProjects.useQuery(undefined, {
    retry: 0,
    enabled: !!session,
  });

  if (accountError) return <Error></Error>;
  if (accountLoading || sessionStatus === "loading") return <Loading></Loading>;
  return (
    <div className="flex h-fit flex-col gap-8 px-12 py-12 lg:gap-12 xl:gap-16 xl:px-24 2xl:px-36">
      <span className="text-xl text-slate-600 dark:text-slate-300">
        hey there
        <h1 className="max-w-[24ch] truncate text-4xl font-semibold text-slate-800 dark:text-slate-100">
          {session.user?.displayName}
        </h1>
      </span>
      <Disclosure as="div" defaultOpen={true}>
        {({ open }) => (
          <>
            <Disclosure.Button className={"mb-4 flex w-fit flex-row items-center gap-2"}>
              <span className="text-2xl font-medium text-slate-700 dark:text-slate-300">
                owned projects
              </span>
              <ChevronUpIcon
                className={`h-6 w-6 ${open ? "" : "rotate-180 transform"}`}
              ></ChevronUpIcon>
            </Disclosure.Button>
            <Disclosure.Panel>
              <OwnedProjectCards ownedProjects={profile.ownedProjects}></OwnedProjectCards>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <Disclosure as="div" defaultOpen={true}>
        {({ open }) => (
          <>
            <Disclosure.Button className={"mb-4 flex w-fit flex-row items-center gap-2"}>
              <span className="text-2xl font-medium text-slate-700 dark:text-slate-300">
                editable projects
              </span>
              <ChevronUpIcon
                className={`h-6 w-6 ${open ? "" : "rotate-180 transform"}`}
              ></ChevronUpIcon>
            </Disclosure.Button>
            <Disclosure.Panel>
              <EditableProjectCards
                editableProjects={profile.editableProjects}
              ></EditableProjectCards>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <Disclosure as="div" defaultOpen={true}>
        {({ open }) => (
          <>
            <Disclosure.Button className={"mb-4 flex w-fit flex-row items-center gap-2"}>
              <span className="text-2xl font-medium text-slate-700 dark:text-slate-300">
                viewable projects
              </span>
              <ChevronUpIcon
                className={`h-6 w-6 ${open ? "" : "rotate-180 transform"}`}
              ></ChevronUpIcon>
            </Disclosure.Button>
            <Disclosure.Panel>
              <EditableProjectCards
                editableProjects={profile.viewableProjects}
              ></EditableProjectCards>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default AccountPage;
