import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { InviteProvider } from "../../../contexts/inviteContext";
import type { RouterOutputs } from "../../../utils/trpc";
import { trpc } from "../../../utils/trpc";
import { InvitedMembers } from "./invitedMembers";
import { UserResult } from "./userResult";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: () => void;
  project: Project;
}

type Project = Pick<RouterOutputs["project"]["overview"], "id" | "editors" | "viewers" | "owner">;

type Invitee = {
  role: "VIEWER" | "EDITOR";
  displayName: string;
};

type SearchResult = RouterOutputs["user"]["findUser"];

export function InviteModal({ open, setOpen, project }: Props): JSX.Element {
  const ctx = trpc.useContext();

  const [input, setInput] = useState<string>();
  const debouncedInput = useDebounce(input, 200);
  const [searchResults, setSearchResults] = useState<SearchResult>([]);

  useEffect(() => {
    if (!debouncedInput) {
      setSearchResults([]);
      return;
    }
    ctx.user.findUser.fetch(debouncedInput).then(setSearchResults);
  }, [debouncedInput, ctx.user.findUser]);

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
                      <div className="mt-2 flex flex-col gap-2">
                        {searchResults.map((user) => (
                          <UserResult
                            key={user.displayName}
                            displayName={user.displayName as string}
                            project={project}
                          ></UserResult>
                        ))}
                      </div>
                    </div>
                    <button className="self-center rounded-md border border-transparent bg-violet-100 px-4 py-2 text-sm font-medium text-violet-900 hover:bg-violet-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 ">
                      send invites
                    </button>
                  </div>
                </InviteProvider>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
