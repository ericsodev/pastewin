import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { Error } from "../../components/error";
import { Loading } from "../../components/loading";
import { signIn, useSession } from "next-auth/react";

const AccountPage: NextPage = (req, res) => {
  const { data: session, status: sessionStatus } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });
  const {
    data: account,
    isLoading: accountLoading,
    isError: accountError,
  } = trpc.user.getPublicProfile.useQuery(
    { userId: session?.user?.id as string },
    {
      retry: 0,
      enabled: !!session,
    }
  );

  if (accountError) return <Error></Error>;
  if (accountLoading || sessionStatus === "loading") return <Loading></Loading>;
  return <div>{account.ownedProjects.map((x) => x.name)}</div>;
};

export default AccountPage;
