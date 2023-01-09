import z from "zod";
import type { NextPage } from "next";
import { Formik, Field, Form } from "formik";
import { trpc } from "../../utils/trpc";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useRouter } from "next/router";
import { Loading } from "../../components/loading";
import { Error } from "../../components/error";
import { signIn, useSession } from "next-auth/react";

interface FormSchemaType {
  name: string;
  public: boolean;
}

const schema = z.object({ name: z.string().max(35), public: z.boolean().default(true) });

const CreateProjectPage: NextPage = (req, res) => {
  const { status } = useSession();
  const router = useRouter();
  const projectMutation = trpc.project.create.useMutation();
  const handleSubmit = async (data: FormSchemaType) => {
    const proj = await projectMutation.mutateAsync({ name: data.name, public: data.public });
    router.push(`/project/${proj.slug}`);
  };

  if (status === "unauthenticated") signIn();
  if (projectMutation.isLoading) return <Loading></Loading>;
  if (projectMutation.isError) return <Error></Error>;

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex flex-col gap-6 rounded-md border border-gray-100 bg-purple-50 bg-opacity-30 bg-clip-padding p-12 shadow-sm backdrop-blur-md backdrop-filter dark:border-gray-800 dark:bg-ch-gray-900/80">
        <h1 className="text-2xl font-medium text-slate-700 dark:text-slate-200">New Project</h1>
        <Formik
          initialValues={{
            name: "",
            public: true,
          }}
          onSubmit={handleSubmit}
          validationSchema={toFormikValidationSchema(schema)}
        >
          {({ errors }) => (
            <Form className="flex flex-col gap-3">
              <label className="text-slate-600 dark:text-slate-300">Project Name</label>
              <Field name="name" className="w-80 rounded-md px-2 py-1 dark:bg-ch-gray-800 "></Field>
              <label className="text-sm font-medium text-red-400">{errors.name}</label>
              <br></br>
              <label className="text-slate-600 dark:text-slate-300">Public</label>
              <Field name="public" type="checkbox" className="w-fit"></Field>
              <button
                type="submit"
                className=" mt-6 self-start rounded-md bg-green-200/70 px-10 py-1.5 font-medium text-green-700 shadow-sm outline-2 outline-offset-0 outline-green-300/50 backdrop-blur-2xl transition-opacity hover:bg-green-200/50 focus:bg-green-200/90 focus:outline dark:bg-indigo-200 dark:bg-opacity-90 dark:text-indigo-900 dark:outline-none dark:hover:bg-opacity-80 dark:focus:bg-opacity-90 dark:focus:outline-4 dark:focus:outline-offset-0 dark:focus:outline-indigo-500/80"
              >
                create
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateProjectPage;
