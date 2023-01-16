import { useState, useEffect } from "react";

type ColorMode = "light" | "dark";
const initialTheme = "dark";

export default function useColorCookie() {
  const [color, setColorState] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return initialTheme;
    }
    const cookie = localStorage.getItem("tailwind-theme");
    if (cookie && cookie in ["light", "dark"]) {
      return cookie as ColorMode;
    }
    return initialTheme;
  });

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     // console.log(localStorage.getItem("tailwind-theme"));
  //     const cookie = localStorage.getItem("tailwind-theme");
  //     if (cookie && cookie in ["light", "dark"]) {
  //       setColor(cookie as ColorMode);
  //       return;
  //     }
  //     setColor("light");
  //   } else {
  //     setColor((color) => color || "light");
  //   }
  // }, []);

  useEffect(() => {
    if (color === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // if (window !== undefined) {
    //   localStorage.setItem("tailwind-theme", color);
    // }
  }, [color]);

  return {
    color,
    setColor: (color: ColorMode) => {
      setColorState(color);

      if (window !== undefined) {
        localStorage.setItem("tailwind-theme", color);
      }
    },
  };
}
