import { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { Error } from "../../../components/error";
import { Loading } from "../../../components/loading";

const PublicAccountPage: NextPage = (req, res) => {
  const router = useRouter();
  const { displayName } = router.query;
  const {
    data: profile,
    isLoading,
    isError,
  } = trpc.user.getProfile.useQuery(
    { displayName: displayName as string },
    {
      retry: 0,
      enabled: typeof displayName === "string",
    }
  );

  if (typeof displayName !== "string" || isError) return <Error></Error>;
  if (isLoading) return <Loading></Loading>;
  return <div>{profile?.displayName}</div>;
};

export default PublicAccountPage;
