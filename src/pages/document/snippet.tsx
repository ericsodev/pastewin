import { Field, Form, Formik } from "formik";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { ErrorModal } from "../../components/CreateSnippetPage/errorModal";
import { Loading } from "../../components/loading";
import { trpc } from "../../utils/trpc";

const schema = z.object({
  name: z.string().min(1, "required").max(35),
  content: z.string().min(1),
});
type FormSchemaType = z.infer<typeof schema>;

const DocumentPage: NextPage = () => {
  const router = useRouter();

  const createStandaloneDocument = trpc.document.createStandalone.useMutation();

  const handleSave = async (values: FormSchemaType) => {
    if (!document) return;
    const { slug } = await createStandaloneDocument.mutateAsync({
      name: values.name,
      content: values.content,
    });
    router.push("/document/" + slug);
  };

  return (
    <div className="flex grow flex-col gap-8 p-16 pb-2 xl:px-36 2xl:px-48">
      <Head>
        <title>Create Snippet | PasteWin</title>
      </Head>
      <Formik
        initialValues={{ name: "", content: "" }}
        validationSchema={toFormikValidationSchema(schema)}
        onSubmit={handleSave}
      >
        {({ errors, getFieldHelpers, values, isSubmitting }) => (
          <Form className="flex grow flex-col gap-2">
            <ErrorModal errors={errors} isSubmitting={isSubmitting}></ErrorModal>
            <div className="flex gap-4">
              <Field
                name="name"
                placeholder="snippet name"
                className="inline-block w-[20ch] truncate border-b-2 border-slate-500 bg-transparent text-4xl font-semibold text-slate-800 placeholder:font-medium placeholder:text-slate-500 focus:border-b-violet-400 focus:outline-none dark:border-slate-200 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-violet-300"
              ></Field>
              <button
                type="submit"
                className="text-medium self-center rounded-md bg-green-200 px-4 py-1.5 font-medium text-green-800"
              >
                publish
              </button>
            </div>
            <div className="relative flex grow flex-col gap-2 py-2">
              {createStandaloneDocument.isLoading && (
                <div className="absolute top-0 bottom-0 left-0 right-0">
                  <Loading></Loading>
                </div>
              )}
              <textarea
                className={`grow basis-96 resize-none rounded-md bg-ch-gray-50 px-6 py-4 outline-none ring-2 ring-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:bg-ch-gray-700 dark:focus:ring-violet-500 ${
                  createStandaloneDocument.isLoading
                    ? "border-emerald-200 bg-ch-gray-200/90 ring-4 ring-emerald-200 dark:bg-ch-gray-800/70"
                    : ""
                }`}
                value={values.content}
                onChange={(e) => getFieldHelpers("content").setValue(e.target.value)}
              ></textarea>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DocumentPage;
