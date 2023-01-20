import { Menu } from "@headlessui/react";
import { Cog6ToothIcon, MoonIcon, SunIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useDarkMode } from "usehooks-ts";
import { useEffect } from "react";

export default function SettingsMenu(): JSX.Element {
  const { isDarkMode, toggle, enable, disable } = useDarkMode();
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="rounded-md border-solid bg-slate-50/80 p-1.5 font-medium text-slate-500 backdrop-blur-2xl transition-all hover:bg-slate-50/60 focus:bg-slate-50/90 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-800/80 dark:focus:bg-slate-700/80">
        <Cog6ToothIcon className="h-5 w-5"></Cog6ToothIcon>
      </Menu.Button>
      <Menu.Items className="absolute right-0 mt-2 min-w-fit origin-top-right divide-y-2 divide-gray-300/70 rounded-md bg-slate-50/60 px-1 py-0.5 text-sm text-slate-600 shadow-md backdrop-blur-2xl">
        <div className="px-0.5 py-0.5">
          <Menu.Item>
            {({ active }) => (
              <button className="my-1 inline-flex w-full items-center justify-start gap-1.5 rounded-md p-2 hover:bg-slate-200 hover:bg-opacity-70">
                <UserCircleIcon className="h-5 w-5"></UserCircleIcon>
                Account
              </button>
            )}
          </Menu.Item>
        </div>
        <div className="px-0.5 py-0.5">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => toggle()}
                className="inline-flex w-max items-center justify-start gap-1.5 rounded-md p-2 hover:bg-slate-200 hover:bg-opacity-70"
              >
                {!isDarkMode ? (
                  <SunIcon className="h-5 w-5"></SunIcon>
                ) : (
                  <MoonIcon className="h-5 w-5"></MoonIcon>
                )}
                Toggle theme
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}
