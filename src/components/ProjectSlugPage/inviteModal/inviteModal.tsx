import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import type { RouterOutputs } from "../../../utils/trpc";
import { trpc } from "../../../utils/trpc";
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
  const invite = trpc.project.invite.useMutation();

  const [invitees, setInvitees] = useState<Invitee[]>([]);
  const [removedMembers, setRemovedMembers] = useState<{ displayName: string }[]>([]);

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

  const removeMember = (displayName: string) => {
    setInvitees((v) => v.filter((i) => i.displayName !== displayName));
    if ([...project.editors, ...project.viewers].some((m) => m.displayName === displayName)) {
      // setRemovedMembers(v => v.``)
    }
  };
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
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Invite Members
                </Dialog.Title>
                <div className="mt-4 flex flex-col gap-4">
                  <div>
                    <input
                      className="rounded-md py-1 px-3  text-slate-800"
                      placeholder="search users"
                      onChange={async (e) => {
                        setInput(e.target.value);
                      }}
                    ></input>
                  </div>
                  <div className="h-64 overflow-y-scroll">
                    {
                      <>
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
                      </>
                    }
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
