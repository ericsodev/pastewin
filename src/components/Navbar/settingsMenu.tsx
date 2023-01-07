import { Menu } from "@headlessui/react";
import { MdAccountCircle } from "react-icons/md";
import { HiSun } from "react-icons/hi";
import { IoMdMoon } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { useColorMode } from "../../contexts/colorModeContext";

export default function SettingsMenu(): JSX.Element {
  const { color, toggleColor } = useColorMode();
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="rounded-md border-solid bg-slate-50/80 p-1.5 text-xl font-medium text-slate-500 backdrop-blur-2xl transition-all hover:bg-slate-50/60 focus:bg-slate-50/90 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-800/80 dark:focus:bg-slate-700/80">
        <IoMdSettings></IoMdSettings>
      </Menu.Button>
      <Menu.Items className="absolute right-0 min-w-fit origin-top-right divide-y-2 divide-gray-300/70 rounded-md bg-slate-50/60 px-1 py-0.5 text-sm text-slate-600 shadow-md backdrop-blur-2xl">
        <div className="px-0.5 py-0.5">
          <Menu.Item>
            {({ active }) => (
              <button className="my-1 inline-flex w-full items-center justify-start gap-1.5 rounded-md p-2 hover:bg-slate-200 hover:bg-opacity-70">
                <MdAccountCircle className="text-lg"></MdAccountCircle>
                account
              </button>
            )}
          </Menu.Item>
        </div>
        <div className="px-0.5 py-0.5">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => toggleColor()}
                className="inline-flex w-max items-center justify-start gap-1.5 rounded-md p-2 hover:bg-slate-200 hover:bg-opacity-70"
              >
                {color === "light" ? (
                  <HiSun className="text-lg"></HiSun>
                ) : (
                  <IoMdMoon className="text-lg"></IoMdMoon>
                )}
                toggle theme
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}
