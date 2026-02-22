import { useEffect } from "react";

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return <>{children}</>;
};

export default ThemeWrapper;
