import { Typewriter } from "react-simple-typewriter";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex grow items-center justify-center">
      <div className="md:1/2 relative flex w-2/3 flex-col justify-center lg:w-1/3">
        <div className="absolute inset-x-5 inset-y-10 -z-10 opacity-50 blur-3xl dark:bg-indigo-400">
          f
        </div>
        <h1 className="after:content-[' '] relative m-0 w-max text-center text-6xl  font-bold text-slate-700 after:inset-0 after:bg-red-300 dark:text-violet-50 md:text-6xl lg:text-6xl xl:text-7xl">
          share your{" "}
          <strong className="font-extrabold text-indigo-600/90 dark:text-indigo-400">
            <Typewriter words={["code", "ideas"]}></Typewriter>
          </strong>
          <Link
            className="mt-5 block w-fit self-start rounded-md bg-green-200/70 px-3.5 py-2.5 text-base font-medium text-green-700 outline-2 outline-offset-0 outline-green-300/50 drop-shadow backdrop-blur-2xl transition-opacity hover:bg-green-200/50 focus:bg-green-200/90 focus:outline dark:bg-indigo-200 dark:bg-opacity-90 dark:text-indigo-900 dark:outline-none dark:hover:bg-opacity-80 dark:focus:bg-opacity-90 dark:focus:outline-4 dark:focus:outline-offset-0 dark:focus:outline-indigo-500/80"
            href="/document/snippet"
          >
            create snippet
          </Link>
        </h1>
      </div>
    </div>
  );
}
