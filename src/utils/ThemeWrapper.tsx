import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
    
  const theme = useSelector((state: RootState) => state.app.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <>{children}</>;
};

export default ThemeWrapper;
