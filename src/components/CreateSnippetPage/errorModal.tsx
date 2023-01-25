import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

export function ErrorModal({
  errors,
  isSubmitting,
}: {
  errors: Partial<{ name: string; content: string }>;
  isSubmitting: boolean;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if ((errors.name || errors.content) && isSubmitting) setOpen(true);
  }, [errors, isSubmitting]);
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
                  className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-gray-200"
                >
                  Submission Error
                </Dialog.Title>
                <div className="flex flex-col items-start gap-4 font-medium text-gray-700 dark:text-slate-400">
                  {errors.name && <div>Name: {errors.name}</div>}
                  {errors.content && <div>Content: {errors.content}</div>}
                  <button
                    onClick={() => setOpen(false)}
                    className="inline-flex justify-center rounded-md border border-transparent bg-violet-100 px-3 py-1.5 font-medium text-violet-900 hover:bg-violet-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 "
                  >
                    dismiss
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
