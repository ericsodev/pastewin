import React, { useContext } from "react";
import useColorCookie from "../hooks/useColorCookie";

type ColorMode = "light" | "dark";

interface ColorModeContext {
  color: ColorMode;
  setColor: (v: ColorMode) => void;
  toggleColor: () => void;
}
const ColorModeCtx = React.createContext<ColorModeContext>({
  color: "dark",
  setColor: (v) => {
    return;
  },
  toggleColor: () => {
    return;
  },
});

export function ColorModeProvider(props: React.PropsWithChildren): JSX.Element {
  const { color, setColor } = useColorCookie();
  return (
    <ColorModeCtx.Provider
      value={{
        color: color,
        setColor: setColor,
        toggleColor: () => {
          setColor((v) => (v === "light" ? "dark" : "light"));
        },
      }}
    >
      {props.children}
    </ColorModeCtx.Provider>
  );
}

export function useColorMode() {
  return useContext(ColorModeCtx);
}
