import { useState, useEffect } from "react";

type ColorMode = "light" | "dark";

export default function useColorCookie() {
  const [color, setColor] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // console.log(localStorage.getItem("tailwind-theme"));
      const cookie = localStorage.getItem("tailwind-theme");
      console.log(cookie);
      if (cookie && cookie in ["light", "dark"]) {
        setColor(cookie as ColorMode);
        return;
      }
      setColor("light");
    } else {
      setColor((color) => color || "light");
    }
  }, []);

  useEffect(() => {
    if (color === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    if (window !== undefined) {
      localStorage.setItem("tailwind-theme", color);
    }
  }, [color]);

  return { color, setColor };
}
