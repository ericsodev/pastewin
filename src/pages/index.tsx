import { Typewriter } from 'react-simple-typewriter';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex h-full items-center justify-center">
            <div className="relative flex w-1/3 flex-col justify-center gap-4">
                <div className="absolute top-0 bottom-0 right-0 left-0 ">
                    {/* glow */}
                </div>
                <h1 className="m-0 w-full text-7xl font-bold text-slate-700 dark:text-violet-50 dark:drop-shadow-[0_35px_35px_rgba(179,118,219,0.25)]">
                    share your{' '}
                    <strong className="text-indigo-600/90 dark:text-indigo-400">
                        <Typewriter words={['code', 'ideas']}></Typewriter>
                    </strong>
                </h1>
                <Link
                    className="mt-5 self-start rounded-md bg-green-200/70 px-3.5 py-2.5 font-medium text-green-700 outline-2 outline-offset-0 outline-green-300/50 drop-shadow backdrop-blur-2xl transition-opacity hover:bg-green-200/50 focus:bg-green-200/90 focus:outline dark:bg-indigo-200 dark:bg-opacity-90 dark:text-indigo-900 dark:outline-none dark:hover:bg-opacity-80 dark:focus:bg-opacity-90 dark:focus:outline-4 dark:focus:outline-offset-0 dark:focus:outline-indigo-500/80"
                    href="/createSnippet"
                >
                    create snippet
                </Link>
            </div>
        </div>
    );
}
