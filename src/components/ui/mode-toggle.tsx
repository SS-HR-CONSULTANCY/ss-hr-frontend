import { ChevronsUpDownIcon } from "lucide-react";
import { useEffect,useState } from "react";

import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { setTheme } from "@/store/slices/appSlice";

export function ModeToggle() {

  const dispatch = useDispatch<AppDispatch>();
  const [mounted, setMounted] = useState(false);
  const theme = useSelector((state: RootState) => state.app.theme);


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-1 px-2 py-0 text-xs">
          <span className="capitalize">{theme}</span>
          <span className="inline"> theme</span>
          <ChevronsUpDownIcon className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => dispatch(setTheme("light"))}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => dispatch(setTheme("dark"))}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => dispatch(setTheme("system"))}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
