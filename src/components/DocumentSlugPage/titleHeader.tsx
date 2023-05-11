import Link from "next/link";
import { TitleInput } from "./titleInput";
import {
  ClockIcon,
  Cog6ToothIcon,
  FolderIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { Menu } from "@headlessui/react";
import { useDocument } from "../../contexts/documentContext";
import DeleteDocumentModal from "./deleteDocumentModal";
import { useState } from "react";
import RevisionsModal from "./revisionsModal";
import SaveRevisionsModal from "./saveRevisionModal";

export function TitleHeader(): JSX.Element {
  const { document, refetch } = useDocument();
  const [deleteModalOpen, setDeleteModal] = useState(false);
  const [revisionModalOpen, setRevisionModal] = useState(false);
  const [saveModalOpen, setSaveModal] = useState(false);

  if (!document) {
    return <h1>Error</h1>;
  }
  const project = document.project;

  return (
    <>
      <DeleteDocumentModal
        open={deleteModalOpen}
        setOpen={setDeleteModal}
      ></DeleteDocumentModal>
      <RevisionsModal
        open={revisionModalOpen}
        setOpen={setRevisionModal}
      ></RevisionsModal>
      <SaveRevisionsModal
        open={saveModalOpen}
        setOpen={setSaveModal}
      ></SaveRevisionsModal>
      <div>
        <div className="flex flex-row items-baseline gap-3">
          {project && ["OWNER", "EDITOR"].includes(document.role) ? (
            <TitleInput refetch={refetch} document={document}></TitleInput>
          ) : (
            <h1 className="text-4xl font-semibold text-slate-800 dark:text-slate-100">
              {document.name}{" "}
            </h1>
          )}
          {project && (
            <span className="text-2xl font-normal text-slate-400">
              {" "}
              by{" "}
              <Link
                href={`/account/public/${project.owner.displayName}`}
                className="font-medium"
              >
                {project.owner.displayName}
              </Link>
            </span>
          )}
          <div className="ml-auto">
            <Menu as="div" className="relative">
              <Menu.Button
                className="rounded-md border-solid bg-slate-50/80 p-1.5 font-medium text-slate-500 
            backdrop-blur-2xl transition-all hover:bg-slate-50/60 focus:bg-slate-50/90 dark:bg-slate-800
             dark:text-slate-100 dark:hover:bg-slate-800/80 dark:focus:bg-slate-700/80"
              >
                <Cog6ToothIcon className="h-5 w-5"></Cog6ToothIcon>
              </Menu.Button>
              <Menu.Items
                className="absolute right-0 z-20 mt-2 min-w-fit origin-top-right divide-y-2 divide-gray-300 
            rounded-md bg-slate-50/60 px-1 py-0.5 text-sm text-slate-600 shadow-md backdrop-blur-2xl
             dark:divide-gray-700 dark:border-2 dark:border-gray-800 dark:bg-slate-800/30 dark:text-slate-300"
              >
                {["OWNER", "EDITOR"].includes(document.role) && (
                  <div className="px-0.5 py-1">
                    <Menu.Item
                      as="button"
                      onClick={() => setSaveModal(true)}
                      className="inline-flex w-full items-center justify-start gap-2.5 rounded-md p-2 hover:bg-slate-400/30 hover:bg-opacity-70 dark:hover:bg-slate-700"
                    >
                      <FolderIcon className="h-4 w-4"></FolderIcon>
                      save as
                    </Menu.Item>
                  </div>
                )}
                <div className="px-0.5 py-1">
                  <Menu.Item
                    as="button"
                    onClick={() => setRevisionModal(true)}
                    className="inline-flex w-full items-center justify-start gap-2.5 rounded-md p-2 hover:bg-slate-400/30 hover:bg-opacity-70 dark:hover:bg-slate-700"
                  >
                    <ClockIcon className="h-4 w-4"></ClockIcon>
                    revisions
                  </Menu.Item>
                </div>
                {/* Delete is for owner/editor only */}
                {["EDITOR", "OWNER"].includes(document.role) && (
                  <div className="px-0.5 py-1">
                    <Menu.Item
                      as="button"
                      onClick={() => setDeleteModal(true)}
                      className="dark:text-red-680 dark:hover:text-red-30 inline-flex w-full items-center justify-start gap-2.5
                     rounded-md bg-red-400/80 p-2 text-red-800 hover:bg-red-500/90 hover:bg-opacity-70
                      hover:text-red-900 dark:bg-red-300/90 dark:hover:bg-red-400"
                    >
                      <TrashIcon className="h-4 w-4"></TrashIcon>
                      delete
                    </Menu.Item>
                  </div>
                )}
              </Menu.Items>
            </Menu>
          </div>
        </div>
        {project && (
          <h2 className="mb-4 text-lg text-slate-600 dark:text-slate-400">
            from
            <Link
              href={`/project/${project.slug}`}
              className="font-medium text-slate-700 dark:text-slate-300"
            >
              {" "}
              {project.name}
            </Link>
          </h2>
        )}
      </div>
    </>
  );
}
