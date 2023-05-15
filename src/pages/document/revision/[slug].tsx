import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { TitleHeader } from "../../../components/DocumentSlugPage/titleHeader";
import { Error } from "../../../components/error";
import { Loading } from "../../../components/loading";
import { trpc } from "../../../utils/trpc";
import { RevisionProvider } from "../../../contexts/revisionContext";
import { RevisionTitleHeader } from "../../../components/DocumentSlugPage/revisions/revisionTitleHeader";

const DocumentPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const {
    data: revision,
    isLoading,
    isError,
    error,
    refetch,
  } = trpc.document.getRevision.useQuery(
    { slug: slug as string },
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

  if (!slug) return <Error></Error>;
  if (error?.data?.code === "UNAUTHORIZED")
    return <Error>This document is private.</Error>;
  if (error?.data?.code === "NOT_FOUND")
    return <Error>Revision not found.</Error>;
  if (isError) return <Error></Error>;
  if (isLoading) return <Loading></Loading>;

  return (
    <RevisionProvider revision={revision} refetch={refetch}>
      <div className="flex grow flex-col gap-8 p-16 pb-2 xl:px-36 2xl:px-48">
        <Head>
          <title>{revision.name} | PasteWin</title>
        </Head>
        <div>
          <RevisionTitleHeader></RevisionTitleHeader>
        </div>
        <div className="relative flex grow flex-col gap-2 py-2">
          {documentMutate.isLoading && (
            <div className="absolute top-0 bottom-0 left-0 right-0">
              <Loading></Loading>
            </div>
          )}
          <textarea
            readOnly={true}
            className={`grow basis-96 resize-none rounded-md bg-ch-gray-50 px-6 py-4 outline-none ring-2 ring-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:bg-ch-gray-700 dark:focus:ring-violet-500 ${
              documentMutate.isLoading
                ? "border-emerald-200 bg-ch-gray-200/90 ring-4 ring-emerald-200 dark:bg-ch-gray-800/70"
                : ""
            }`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
      </div>
    </RevisionProvider>
  );
};

export default DocumentPage;
