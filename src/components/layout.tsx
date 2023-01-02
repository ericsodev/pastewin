import Head from "next/head";
import Navbar from "./navbar";
import { SessionProvider } from "next-auth/react";
import { ColorModeProvider } from "../contexts/colorModeContext";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      <Head>
        <title>PasteWin</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ColorModeProvider>
        <div
          tabIndex={0}
          className="relative flex h-full w-full flex-col text-neutral-800 dark:bg-black/50 dark:text-indigo-50"
        >
          <div className="dark:bg-ch-gray-800 absolute top-0 bottom-0 right-0 left-0 -z-10 bg-white/60 backdrop-blur-xl dark:backdrop-blur-0"></div>
          <div className="absolute top-0 bottom-0 right-0 left-0 -z-20 bg-gradient-to-br from-green-300 via-blue-500/90 to-purple-600"></div>
          <SessionProvider>
            {" "}
            <Navbar></Navbar>
            {children}
          </SessionProvider>
        </div>
      </ColorModeProvider>
    </>
  );
}
