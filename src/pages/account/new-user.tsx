import { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { signIn, useSession } from "next-auth/react";
import { Loading } from "../../components/loading";
import { z } from "zod";
import { Formik, Form, Field } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";

interface FormSchemaType {
  name: string;
}
const schema = z.object({ name: z.string().min(1).max(20) });

const NewUserPage: NextPage = (req, res) => {
  const { data: session, status } = useSession();
  const { user } = trpc.useContext();
  const nameMutation = trpc.user.changeName.useMutation();
  if (status === "loading") return <Loading></Loading>;
  if (status === "unauthenticated") signIn();

  const onSubmit = async (data: FormSchemaType) => {
    await nameMutation.mutateAsync(data.name);
  };
  const validate = async (values: FormSchemaType) => {
    try {
      const taken = await user.nameTaken.fetch(values.name);
      if (taken) return { name: `${values.name} is already in use` };
    } catch (e) {
      return { name: `please enter a name less than 20 characters long` };
    }
  };
  return (
    <div className="flex h-full w-full flex-col items-center gap-5">
      <div className="flex basis-1/4 flex-col justify-center">
        <h1 className=" text-4xl font-medium text-slate-700">Hello there</h1>
      </div>
      <Formik
        initialValues={{ name: "" }}
        validationSchema={toFormikValidationSchema(schema)}
        validate={validate}
        onSubmit={onSubmit}
      >
        {({ errors }) => (
          <Form className="flex w-full flex-col items-center gap-2">
            <div className="flex flex-col gap-2">
              <label className="">Display Name</label>
              <Field
                className="w-72 rounded-md bg-slate-100/80 px-3 py-1.5 text-slate-600 focus:outline-none"
                name="name"
              ></Field>
            </div>

            <button
              type="submit"
              className="mt-6 w-72 rounded-md bg-green-200/80 px-3 py-1.5 font-medium"
            >
              change name
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NewUserPage;
