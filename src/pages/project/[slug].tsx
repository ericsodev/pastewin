import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { Loading } from "../../components/loading";
import { Error } from "../../components/error";
import Link from "next/link";
import dayjs from "dayjs";
import Head from "next/head";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { NewDocumentModal } from "../../components/ProjectSlugPage/createDocumentModal";

const gridSizingClasses =
  "lg:grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] 2xl:grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] 4xl:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]";

const ProjectPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const {
    data: project,
    isLoading,
    isError,
    refetch,
  } = trpc.project.overview.useQuery(
    { projectSlug: slug as string },
    {
      enabled: typeof slug === "string",
    }
  );
  const createDocument = trpc.project.createDocument.useMutation();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  if (isError) return <Error></Error>;
  if (isLoading) return <Loading></Loading>;
  return (
    <div className="flex flex-col gap-8 p-16 xl:px-36 2xl:px-48">
      <Head>
        <title>{project.name} | PasteWin</title>
      </Head>
      <div className="flex h-max flex-row items-end gap-2">
        <h1 className="max-w-[24ch] truncate text-4xl font-semibold text-slate-800 dark:text-slate-100">
          {project.name}{" "}
        </h1>
        <span className="text-2xl font-normal text-slate-400">
          {" "}
          by{" "}
          <Link href={`/account/public/${project.owner.displayName}`} className="font-medium">
            {project.owner.displayName}
          </Link>
        </span>
      </div>
      <div>
        <h2 className="mb-4 text-2xl font-medium text-slate-700 dark:text-slate-300">documents</h2>
        <div className={`grid auto-rows-fr gap-4 ${gridSizingClasses}`}>
          {project.documents.map((v) => (
            <Link href={`/document/${v.slug}`} key={v.id}>
              <div
                tabIndex={0}
                className="flex h-full cursor-pointer flex-col gap-10 rounded-md border-[2px] border-white/50 bg-gradient-to-br from-white/40 to-white/10 px-8 py-6 hover:border-white/30 hover:from-white/30 dark:border-gray-800 dark:from-gray-900 dark:to-gray-800/50 dark:hover:border-violet-500/40"
              >
                <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
                  {v.name}
                </h2>

                <p className="max-w-xs text-slate-600 dark:text-slate-400">
                  created on{" "}
                  <strong className="font-semibold">
                    {dayjs(v.createdAt).format("MMM D YYYY")}
                  </strong>
                </p>
              </div>
            </Link>
          ))}
          <div
            tabIndex={0}
            onClick={() => setModalOpen(true)}
            className="group flex cursor-pointer items-center justify-center gap-10 rounded-md border-[2px] border-white/50 bg-gradient-to-br from-white/40 to-white/10 px-8 py-6 hover:border-white/30 hover:from-white/30 dark:border-gray-800 dark:from-gray-900 dark:to-gray-800/50 dark:hover:border-violet-500/40"
          >
            <PlusIcon className="h-9 w-9 transform text-slate-700 transition-transform duration-75 group-hover:scale-110 group-focus:scale-90"></PlusIcon>
          </div>
        </div>
      </div>
      <NewDocumentModal
        refresh={() => refetch()}
        projectId={project.id}
        open={modalOpen}
        setOpen={setModalOpen}
      ></NewDocumentModal>
    </div>
  );
};

export default ProjectPage;
