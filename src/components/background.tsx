export function Background(): JSX.Element {
  return (
    <>
      <div className="absolute top-0 bottom-0 right-0 left-0 -z-10 bg-white/50 backdrop-blur-[100px] dark:bg-ch-gray-800 dark:backdrop-blur-0"></div>
      <div className="absolute inset-0 -z-20 backdrop-blur-3xl">
        <div className="absolute bottom-0 right-0 h-1/2 w-1/2 rounded-tl-full bg-violet-400/70 mix-blend-color"></div>
        <div className="absolute top-0 left-0 h-1/2 w-1/2 rounded-br-full bg-purple-500/40 mix-blend-color"></div>
        <div className="absolute top-0 right-0 h-1/2 w-2/3 rounded-bl-full bg-blue-500/40 mix-blend-color"></div>
        <div className="absolute bottom-0 left-0 h-1/2 w-2/3 rounded-tr-full bg-cyan-200 mix-blend-color"></div>
      </div>
      {/* <div className="absolute top-0 bottom-0 right-0 left-0 -z-30 bg-gradient-to-br from-green-300 via-blue-500/90 to-purple-600 opacity-50"></div> */}
    </>
  );
}
