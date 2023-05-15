import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { useDocument } from "../../contexts/documentContext";
import { ClockIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { Loading } from "../loading";
import dayjs from "dayjs";
interface Props {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}
export default function RevisionsModal({ open, setOpen }: Props): JSX.Element {
  const { document } = useDocument();
  const router = useRouter();
  const {
    data: revisions,
    isLoading,
    isError,
  } = trpc.document.revisions.useQuery(
    {
      documentId: document?.id ?? "",
    },
    { enabled: document !== undefined }
  );
  const selected = false;
  if (!document) return <h1>error</h1>;

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
                  className="mb-4 flex text-lg font-medium leading-6 text-gray-900 dark:text-gray-200"
                >
                  <div>
                    Revisions for{" "}
                    <strong className="font-semibold">{document.name}</strong>
                  </div>
                  <span className="ml-auto">
                    <XMarkIcon
                      className="h-5 w-5 hover:scale-110 hover:text-black dark:hover:text-white"
                      onClick={() => setOpen(false)}
                    ></XMarkIcon>
                  </span>
                </Dialog.Title>
                <div className="mt-6 w-full">
                  {isLoading && <Loading></Loading>}
                  {!isLoading && !isError && revisions.length === 0 ? (
                    <h3 className="mx-auto inline-block font-medium text-slate-600">
                      no saved revisions
                    </h3>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {revisions?.map((x) => (
                        <li
                          key={x.id}
                          tabIndex={0}
                          onClick={() =>
                            router.push("/document/revision/" + x.slug)
                          }
                          className="flex cursor-pointer items-center rounded-md bg-gray-200/50 py-1.5 px-4 font-medium text-gray-700 hover:bg-gray-200 focus:bg-gray-200/90 active:scale-[0.98] dark:text-gray-300"
                        >
                          <text>{x.name}</text>
                          <text className="ml-auto text-sm text-gray-500 ">
                            {dayjs(x.createdAt).format("MMM DD, YYYY")}
                          </text>
                        </li>
                      )) ?? <></>}
                    </ul>
                  )}
                </div>
                <div className="mt-8">
                  {selected && (
                    <button
                      className="dark:text-red-680 dark:hover:text-red-30 mx-auto inline-flex w-1/2 items-center justify-start gap-2.5
                     rounded-md bg-red-400/80 p-2 text-red-800 hover:bg-red-500/90 hover:bg-opacity-70
                      hover:text-red-900 dark:bg-red-300/90 dark:hover:bg-red-400"
                    >
                      <ClockIcon className="h-4 w-4"></ClockIcon>
                      confirm revert
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
