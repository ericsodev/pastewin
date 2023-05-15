import { Dialog, Transition } from "@headlessui/react";
import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import React, { Fragment } from "react";
interface Props {
  message: string;
  open: boolean;
  setOpen: (x: boolean) => void;
}
export default function ErrorModal({ message, open, setOpen }: Props) {
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-slate-50 p-6 text-left align-middle shadow-xl transition-all dark:bg-ch-gray-800">
                <Dialog.Title
                  as="h3"
                  className="flex items-center gap-2 text-lg font-medium leading-6 text-gray-900 dark:text-gray-200"
                >
                  <div>Error</div>
                  <ExclamationCircleIcon className="h-6 w-6 text-rose-400"></ExclamationCircleIcon>
                  <span className="ml-auto">
                    <XMarkIcon
                      className="h-5 w-5 hover:scale-110 hover:text-black dark:hover:text-white"
                      onClick={() => setOpen(false)}
                    ></XMarkIcon>
                  </span>
                </Dialog.Title>
                <div className="mt-4 font-medium text-gray-800 dark:text-gray-300">
                  {message}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
