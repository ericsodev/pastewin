import { Field, Form, Formik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { trpc } from "../../utils/trpc";
import type { RouterOutputs } from "../../utils/trpc";
import { useState, useRef } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { CheckIcon } from "@heroicons/react/24/solid";

interface Props {
  //   project: {
  //     id: string;
  //     name: string;
  //     [x: string | number | symbol]: unknown;
  //   };
  project: Pick<RouterOutputs["project"]["overview"], "name" | "id">;
  refetch: () => void;
}

const schema = z.object({ title: z.string().min(1, "required").max(35) });
type FormSchema = z.infer<typeof schema>;

export function TitleInput({ project, refetch }: Props): JSX.Element {
  const ref = useRef(null);
  const [expanded, setExpanded] = useState(false);
  useClickOutside(ref, (e) => setExpanded(false));

  const projectMutation = trpc.project.renameProject.useMutation();
  const handleSubmit = async (values: FormSchema) => {
    if (values.title !== project.name) {
      await projectMutation.mutateAsync({ projectId: project.id, newName: values.title });
      refetch();
    }
    setExpanded(false);
  };
  /** TODO: jan 16
   * use state for toggle click
   * use react hook to handle click elsewhere (to close input)
   * remove group modifiers
   */
  return (
    <>
      <div
        onClick={() => {
          setExpanded(true);
        }}
        className="group"
        ref={ref}
      >
        {expanded ? (
          <Formik
            initialValues={{
              title: project.name,
            }}
            validationSchema={toFormikValidationSchema(schema)}
            onSubmit={handleSubmit}
          >
            {({ errors }) => (
              <Form className="mr-8">
                <Field
                  name="title"
                  className="inline-block w-[14ch] truncate border-b-2 bg-transparent text-4xl font-semibold text-slate-800 focus:border-b-violet-200 focus:outline-none dark:text-slate-100"
                ></Field>
                <button
                  type="submit"
                  className="ml-5 rounded-md bg-green-200 p-1 transition-colors hover:bg-green-300 focus:bg-green-300/80"
                >
                  <CheckIcon className="h-6 w-6 font-semibold text-green-800"></CheckIcon>
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <h1 className="max-w-[24ch] truncate text-4xl font-semibold text-slate-800 dark:text-slate-100">
            {project.name}{" "}
          </h1>
        )}
      </div>
    </>
  );
}
