import { Transition } from "@headlessui/react";
import { Fragment } from "react";

interface Props extends React.PropsWithChildren {
  position?: "tr" | "tl";
  isOpen: boolean;
}
export function Toast({ isOpen, children, position = "tr" }: Props): JSX.Element {
  const positionClasses = position === "tr" ? "top-5 right-5" : "top-5 left-5";
  return (
    <>
      {isOpen && (
        <Transition
          show={isOpen}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className={`absolute z-20 ${positionClasses}`}>{children}</div>
        </Transition>
      )}
    </>
  );
}
