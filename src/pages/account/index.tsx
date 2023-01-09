import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { Error } from "../../components/error";
import { Loading } from "../../components/loading";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

const AccountPage: NextPage = (req, res) => {
  const { data: session, status: sessionStatus } = useSession();
  const {
    data: account,
    isLoading: accountLoading,
    isError: accountError,
  } = trpc.user.getProfile.useQuery(
    { userId: session?.user?.id as string },
    {
      retry: 0,
      enabled: !!session,
    }
  );
  useEffect(() => {
    if (sessionStatus === "unauthenticated") signIn();
  }, [sessionStatus]);

  if (accountError) return <Error></Error>;
  if (accountLoading || sessionStatus === "loading") return <Loading></Loading>;
  return <div>{account.ownedProjects.map((x) => x.name)}</div>;
};

export default AccountPage;
