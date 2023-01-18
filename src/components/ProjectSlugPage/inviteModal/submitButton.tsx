import { useEffect, useState } from "react";
import type { InviteState } from "../../../contexts/inviteContext";
import { useInvites } from "../../../contexts/inviteContext";

interface Props {
  sendInvites: (invite: InviteState) => Promise<void>;
}
export function SubmitButton({ sendInvites }: Props): JSX.Element {
  const { state, dispatch } = useInvites();
  const [sending, setSending] = useState<boolean>(false);
  useEffect(() => {
    console.log(state);
  }, [state]);
  const handleSend = async () => {
    setSending(true);
    await sendInvites(state);
    setSending(false);
    dispatch({ type: "CLEAR" });
  };
  return (
    <button
      onClick={handleSend}
      className="self-center rounded-md border border-transparent bg-violet-100 px-4 py-2 text-sm font-medium text-violet-900 hover:bg-violet-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 "
      disabled={sending}
    >
      {sending ? "sending" : "send invites"}
    </button>
  );
}
