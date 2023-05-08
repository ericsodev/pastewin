import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { useDocument } from "../../contexts/documentContext";
import { TrashIcon } from "@heroicons/react/20/solid";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
interface Props {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}
export default function DeleteDocumentModal({
  open,
  setOpen,
}: Props): JSX.Element {
  const { document } = useDocument();
  const router = useRouter();
  const { mutateAsync, isLoading, isError } =
    trpc.document.deleteDocument.useMutation();

  if (!document) return <h1>error</h1>;

  const deleteDocument = async () => {
    await mutateAsync({ documentId: document.id });
    if (!document.project) {
      router.push("/");
    } else {
      router.push("/project/" + document.project.slug);
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-slate-50 p-6 text-left align-middle shadow-xl transition-all dark:bg-ch-gray-800">
                <Dialog.Title
                  as="h3"
                  className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-gray-200"
                >
                  Delete Document: {document.name}
                </Dialog.Title>
                <div className="flex gap-5">
                  <button
                    className="dark:text-red-680 dark:hover:text-red-30 mx-auto inline-flex w-1/2 items-center justify-start gap-2.5
                     rounded-md bg-blue-400/80 p-2 text-blue-800 hover:bg-blue-500/90 hover:bg-opacity-70
                      hover:text-blue-900 dark:bg-blue-300/90 dark:hover:bg-blue-400"
                    onClick={() => setOpen(false)}
                  >
                    <TrashIcon className="h-4 w-4"></TrashIcon>
                    cancel
                  </button>
                  <button
                    className="dark:text-red-680 dark:hover:text-red-30 mx-auto inline-flex w-1/2 items-center justify-start gap-2.5
                     rounded-md bg-red-400/80 p-2 text-red-800 hover:bg-red-500/90 hover:bg-opacity-70
                      hover:text-red-900 dark:bg-red-300/90 dark:hover:bg-red-400"
                    onClick={deleteDocument}
                  >
                    <TrashIcon className="h-4 w-4"></TrashIcon>
                    delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
