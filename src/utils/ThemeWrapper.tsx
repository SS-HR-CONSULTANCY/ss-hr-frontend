import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useSelector((state: RootState) => state.app);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  }, [theme]);

  return <>{children}</>;
};

export default ThemeWrapper;
