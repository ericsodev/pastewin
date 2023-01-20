import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Error } from "../../../components/error";
import { Loading } from "../../../components/loading";
import { EditableProjectCards } from "../../../components/ProfilePage/editableProjects";
import { OwnedProjectCards } from "../../../components/ProfilePage/ownedProjects";
import { trpc } from "../../../utils/trpc";

const PublicAccountPage: NextPage = (req, res) => {
  const router = useRouter();
  const { displayName } = router.query;
  const {
    data: profile,
    isLoading,
    isError,
  } = trpc.user.getPublicProfile.useQuery(
    { displayName: displayName as string },
    {
      retry: false,
      enabled: typeof displayName === "string",
    }
  );

  if (typeof displayName !== "string" || isError) return <Error></Error>;
  if (isLoading) return <Loading></Loading>;
  return (
    <div className="flex flex-col gap-10 px-12 py-12 lg:gap-12 xl:gap-16 xl:px-24 2xl:px-36">
      <h1 className="max-w-[24ch] truncate text-4xl font-semibold text-slate-800 dark:text-slate-100">
        {profile.displayName}
      </h1>
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
                collaborative projects
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
    </div>
  );
};

export default PublicAccountPage;
