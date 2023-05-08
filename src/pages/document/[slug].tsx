import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { TitleHeader } from "../../components/DocumentSlugPage/titleHeader";
import { Error } from "../../components/error";
import { Loading } from "../../components/loading";
import { trpc } from "../../utils/trpc";
import { DocumentProvider } from "../../contexts/documentContext";

const DocumentPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const {
    data: document,
    isLoading,
    isError,
    error,
    refetch,
  } = trpc.document.getDocument.useQuery(
    { documentSlug: slug as string },
    {
      enabled: typeof slug === "string",
      retry: false,
      retryDelay: 5000,
      onSuccess(data) {
        setContent(data.content);
      },
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
    refetch();
  };

  // TODO: check if document is editable, need to add document route to get privileges.

  if (!slug) return <Error></Error>;
  if (error?.data?.code === "UNAUTHORIZED")
    return <Error>This document is private.</Error>;
  if (error?.data?.code === "NOT_FOUND")
    return <Error>Document not found.</Error>;
  if (isError) return <Error></Error>;
  if (isLoading) return <Loading></Loading>;

  return (
    <DocumentProvider document={document} refetch={refetch}>
      <div className="flex grow flex-col gap-8 p-16 pb-2 xl:px-36 2xl:px-48">
        <Head>
          <title>{document.name} | PasteWin</title>
        </Head>
        <div>
          <TitleHeader></TitleHeader>
        </div>
        <div className="relative flex grow flex-col gap-2 py-2">
          {documentMutate.isLoading && (
            <div className="absolute top-0 bottom-0 left-0 right-0">
              <Loading></Loading>
            </div>
          )}
          <textarea
            readOnly={
              document.viewOnly || !["EDITOR", "OWNER"].includes(document.role)
            }
            className={`grow basis-96 resize-none rounded-md bg-ch-gray-50 px-6 py-4 outline-none ring-2 ring-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:bg-ch-gray-700 dark:focus:ring-violet-500 ${
              documentMutate.isLoading
                ? "border-emerald-200 bg-ch-gray-200/90 ring-4 ring-emerald-200 dark:bg-ch-gray-800/70"
                : ""
            }`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>

          {["EDITOR", "OWNER"].includes(document.role) &&
            !document.viewOnly && (
              <button
                onClick={handleSave}
                className="text-medium self-center rounded-md bg-green-200 px-4 py-1.5 font-medium text-green-800"
              >
                save
              </button>
            )}
        </div>
      </div>
      
    </DocumentProvider>
  );
};

export default DocumentPage;
