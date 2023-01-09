import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Error } from "../../components/error";
import { Loading } from "../../components/loading";
import { trpc } from "../../utils/trpc";

const DocumentPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const {
    data: document,
    isLoading,
    isError,
    error,
  } = trpc.document.getDocument.useQuery(
    { documentSlug: slug as string },
    {
      enabled: typeof slug === "string",
    }
  );
  const [content, setContent] = useState<string>("");
  const documentMutate = trpc.document.document.useMutation();

  const handleSave = async () => {
    if (!document) return;
    await documentMutate.mutateAsync({
      documentId: document.id,
      content: content,
    });
  };

  useEffect(() => {
    if (document) {
      setContent(document.content);
    }
  }, [document]);

  if (!slug) return <Error></Error>;
  if (error?.data?.code === "UNAUTHORIZED") return <Error>This document is private.</Error>;
  if (isError) return <Error></Error>;
  if (isLoading) return <Loading></Loading>;

  const project = document.project;
  return (
    <div className="flex h-full flex-col gap-8 p-16 xl:px-36 2xl:px-48">
      <Head>
        <title>{document.name} | PasteWin</title>
      </Head>
      <div>
        <h1 className="text-4xl font-semibold text-slate-800 dark:text-slate-100">
          {document.name}{" "}
          <span className="text-2xl font-normal text-slate-400">
            {" "}
            by{" "}
            <Link href={`/account/public/${project.owner.displayName}`} className="font-medium">
              {project.owner.displayName}
            </Link>
          </span>
        </h1>
        <h2 className="mb-4 text-lg text-slate-600 dark:text-slate-400">
          from
          <Link
            href={`/project/${project.slug}`}
            className="font-medium text-slate-700 dark:text-slate-300"
          >
            {" "}
            {project.name}
          </Link>
        </h2>
      </div>
      <div className="relative flex grow flex-col gap-2 py-2">
        {documentMutate.isLoading && (
          <div className="absolute top-0 bottom-0 left-0 right-0">
            <Loading></Loading>
          </div>
        )}
        <textarea
          contentEditable={document.role === "EDITOR" || document.role === "OWNER"}
          className={`grow basis-96 rounded-md bg-ch-gray-50 px-6 py-4 outline-none focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-ch-gray-700 dark:focus:ring-violet-300 ${
            documentMutate.isLoading
              ? "border-emerald-200 bg-ch-gray-200/90 ring-4 ring-emerald-200 dark:bg-ch-gray-800/70"
              : ""
          }`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button
          onClick={handleSave}
          className="text-medium self-center rounded-md bg-green-200 px-4 py-1.5 font-medium text-green-800"
        >
          save
        </button>
      </div>
    </div>
  );
};

export default DocumentPage;
