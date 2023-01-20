import { Dialog, Transition } from "@headlessui/react";
import { Field, Form, Formik } from "formik";
import React, { Fragment } from "react";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { trpc } from "../../utils/trpc";
import { Loading } from "../loading";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: () => void;
  projectId: string;
}
const schema = z.object({ documentName: z.string().min(1, { message: "required" }).max(35) });
type FormSchemaType = z.infer<typeof schema>;

export function NewDocumentModal({ open, setOpen, refresh, projectId }: Props): JSX.Element {
  const createDocument = trpc.project.createDocument.useMutation();
  const handleSubmit = async (values: FormSchemaType) => {
    await createDocument.mutateAsync({ projectId: projectId, documentName: values.documentName });
    setOpen(false);
    refresh();
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
              {createDocument.isLoading ? (
                <Loading></Loading>
              ) : (
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    New Document
                  </Dialog.Title>
                  <Formik
                    onSubmit={handleSubmit}
                    initialValues={{ documentName: "" }}
                    validationSchema={toFormikValidationSchema(schema)}
                  >
                    {({ errors }) => (
                      <Form>
                        <div className="mt-4 flex flex-col gap-2">
                          <label className="text-sm text-gray-600">Document Name</label>
                          <Field
                            name="documentName"
                            placeholder="new document"
                            className="rounded-md py-1 px-2 text-gray-600 ring-2 ring-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                          ></Field>
                          <label className="text-sm font-medium text-red-400">
                            {errors.documentName}
                          </label>
                        </div>

                        <div className="mt-6">
                          <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-violet-100 px-4 py-2 text-sm font-medium text-violet-900 hover:bg-violet-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 "
                          >
                            create document
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </Dialog.Panel>
              )}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
