import { Dialog, Transition } from "@headlessui/react";
import { Field, Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import Router from "next/router";
import { Fragment } from "react";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { trpc } from "../../utils/trpc";
import { Loading } from "../loading";

interface FormSchemaType {
  name: string;
}
const schema = z.object({ name: z.string().min(1, "required").max(20) });

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function RegisterModal({ open, setOpen }: Props): JSX.Element {
  const { status } = useSession();
  const { user } = trpc.useContext();
  const nameMutation = trpc.user.changeName.useMutation();

  const handleSubmit = async (data: FormSchemaType) => {
    await nameMutation.mutateAsync(data.name);

    // Force Next Auth to refetch session data
    Router.reload();

    setOpen(false);
  };

  const validate = async (values: FormSchemaType) => {
    try {
      // TODO: debounce
      const taken = await user.nameTaken.fetch(values.name);
      if (taken) return { name: `${values.name} is already in use` };
    } catch (e) {}
  };

  return (
    <div>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => null}>
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
                {status === "loading" ? (
                  <Loading></Loading>
                ) : (
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Register Display Name
                    </Dialog.Title>
                    <Formik
                      initialValues={{ name: "" }}
                      validationSchema={toFormikValidationSchema(schema)}
                      validate={validate}
                      onSubmit={handleSubmit}
                    >
                      {({ errors }) => (
                        <Form className="mt-4 flex w-full flex-col gap-2">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-600">Display Name</label>
                            <Field
                              className="rounded-md py-1 px-2 text-gray-600 ring-2 ring-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                              placeholder="john doe"
                              name="name"
                            ></Field>
                            <label className="text-sm font-medium text-red-400">
                              {errors.name}
                            </label>
                          </div>

                          <div className="mt-6">
                            <button
                              type="submit"
                              disabled={!!errors.name}
                              className="inline-flex justify-center rounded-md border border-transparent bg-violet-100 px-4 py-2 text-sm font-medium text-violet-900 hover:bg-violet-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              create user
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
    </div>
  );
}
