import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { useDocument } from "../../contexts/documentContext";
import { ClockIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { trpc } from "../../utils/trpc";
import { z } from "zod";
import { Field, Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { TRPCError } from "@trpc/server";
import ErrorModal from "../global/ErrorModal";

interface Props {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}
const schema = z.object({
  revisionName: z.string().min(1, { message: "required" }).max(35),
});
type FormSchemaType = z.infer<typeof schema>;

export default function SaveRevisionsModal({
  open,
  setOpen,
}: Props): JSX.Element {
  const { document } = useDocument();
  const saveMutate = trpc.document.saveRevision.useMutation();
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  if (!document) return <h1>error</h1>;

  const onSave = async (values: FormSchemaType) => {
    if (!document.id) return;
    try {
      await saveMutate.mutateAsync({
        documentId: document.id,
        revisionName: values.revisionName,
      });
    } catch (e) {
      setErrorMsg("There was an error saving your revision.");
      if (e instanceof TRPCError) {
        if (e.code === "BAD_REQUEST") {
          setErrorMsg(
            "The revision was not saved because it is identical to the previous revision"
          );
        }
      }
      // show error message
      setErrorOpen(true);
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <ErrorModal
        open={errorOpen}
        setOpen={setErrorOpen}
        message={errorMsg}
      ></ErrorModal>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setOpen(false)}
        >
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
                <Dialog.Panel
                  className="w-full max-w-sm transform overflow-hidden rounded-lg 
              bg-slate-50 p-6 text-left align-middle shadow-xl transition-all dark:bg-ch-gray-800"
                >
                  <Dialog.Title
                    as="h3"
                    className="mb-4 flex text-lg font-medium leading-6 text-gray-900 dark:text-gray-200"
                  >
                    <div>
                      Save revision for{" "}
                      <strong className="font-semibold">{document.name}</strong>
                    </div>
                    <span className="ml-auto">
                      <XMarkIcon
                        className="h-5 w-5 hover:scale-110 hover:text-black dark:hover:text-white"
                        onClick={() => setOpen(false)}
                      ></XMarkIcon>
                    </span>
                  </Dialog.Title>
                  <Formik
                    onSubmit={onSave}
                    initialValues={{ revisionName: "" }}
                    validationSchema={toFormikValidationSchema(schema)}
                  >
                    {({ errors }) => (
                      <Form>
                        <div className="mt-4 flex flex-col gap-2.5">
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Revision Name
                          </label>
                          <Field
                            name="revisionName"
                            placeholder="a new revision"
                            className="rounded-md bg-slate-200/80 py-1 px-2 text-gray-600 outline-none focus:outline-2 focus:outline-offset-1 focus:outline-violet-400 dark:bg-ch-gray-600 dark:text-slate-200"
                          ></Field>
                          <label className="h-2 text-sm font-medium text-red-400">
                            {errors.revisionName}
                          </label>
                        </div>

                        <div className="mt-6 flex gap-5">
                          <button
                            className="dark:text-red-680 dark:hover:text-red-30 mx-auto inline-flex items-center justify-between
                     gap-2.5 rounded-md bg-green-400/80 py-1.5 px-4 text-green-800 hover:bg-green-500/90
                      hover:bg-opacity-70 hover:text-green-900 dark:bg-green-300/90 dark:hover:bg-green-400"
                            type="submit"
                          >
                            <ClockIcon className="h-4 w-4"></ClockIcon>
                            <text className="mr-4">save</text>
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
