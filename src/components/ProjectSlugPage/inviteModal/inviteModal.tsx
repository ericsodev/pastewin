import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import type { InviteState } from "../../../contexts/inviteContext";
import { InviteProvider } from "../../../contexts/inviteContext";
import type { RouterOutputs } from "../../../utils/trpc";
import { trpc } from "../../../utils/trpc";
import { InvitedMembers } from "./invitedMembers";
import { SubmitButton } from "./submitButton";
import { UserSearchResult } from "./userSearchResults";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: () => void;
  project: Project;
}

type Project = Pick<
  RouterOutputs["project"]["overview"],
  "id" | "editors" | "viewers" | "owner" | "invitations"
>;

type SearchResult = RouterOutputs["user"]["findUser"];

export function InviteModal({ open, setOpen, project, refresh }: Props): JSX.Element {
  const ctx = trpc.useContext();
  const inviteMutation = trpc.project.invite.useMutation();

  const [input, setInput] = useState<string>();
  const debouncedInput = useDebounce(input, 300);
  const [searchResults, setSearchResults] = useState<SearchResult>([]);

  useEffect(() => {
    if (!debouncedInput) {
      setSearchResults([]);
      return;
    }
    ctx.user.findUser.fetch(debouncedInput).then(setSearchResults);
  }, [debouncedInput, setSearchResults]);

  const sendInvites = useCallback(
    async (invites: InviteState) => {
      console.log("hey");
      const invitees = Array.from(
        Object.entries(invites).map(([name, role]) => {
          return { displayName: name, role: role };
        })
      );
      await inviteMutation.mutateAsync({ projectId: project.id, invitees: invitees });
      refresh();
    },
    [inviteMutation, project.id]
  );

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="mb-4 text-lg font-medium leading-6 text-gray-900">
                  Invite Members
                </Dialog.Title>
                <InviteProvider>
                  <div className="flex flex-col gap-8">
                    <InvitedMembers></InvitedMembers>
                    <div>
                      <input
                        className="rounded-md bg-slate-100 py-1 px-3  text-slate-800"
                        placeholder="search users"
                        onChange={async (e) => {
                          setInput(e.target.value);
                        }}
                      ></input>
                    </div>
                    <div className="h-64 overflow-y-scroll">
                      <h1 className="font-medium text-slate-600">
                        {searchResults.length} {searchResults.length === 1 ? "result" : "results"}
                      </h1>
                      <UserSearchResult
                        searchResults={searchResults}
                        project={project}
                      ></UserSearchResult>
                    </div>
                  </div>
                  <SubmitButton sendInvites={sendInvites}></SubmitButton>
                </InviteProvider>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
