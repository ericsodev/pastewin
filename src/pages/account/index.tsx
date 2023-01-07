import { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { Error } from "../../components/error";
import { Loading } from "../../components/loading";
import { signIn } from "next-auth/react";

const AccountPage: NextPage = (req, res) => {
  const {
    data: session,
    isLoading: sessionLoading,
    isError: sessionError,
  } = trpc.auth.getSession.useQuery();
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

  if (sessionError || accountError) return <Error></Error>;
  if (sessionLoading || accountLoading) return <Loading></Loading>;
  if (!session) signIn();
  return <div>{account.image}</div>;
};

export default AccountPage;
