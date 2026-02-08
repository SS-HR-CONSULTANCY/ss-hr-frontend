import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  NavbarLeft,
  NavbarRight,
  Navbar as NavbarComponent,
} from "@/components/ui/navbar";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import useAuthHook from "@/hooks/useAuthHook";
import { useAppSelector } from "@/hooks/redux";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/ui/navigation";
import { toggleTheme } from "@/store/slices/appSlice";
import { Menu, Moon, Sun, UserCircle } from "lucide-react";
import type { AppDispatch, RootState } from "@/store/store";
import noprofileImage from "../../assets/defaultImgaes/noProfile.png";

import type { NavbarProps } from "@/types/componentTypes/headerTypes";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { siteUrlConfig, navLinks, companyName } from "@/utils/constants";

const Header: React.FC = ({
  name = companyName,
  homeUrl = siteUrlConfig.home,
  showNavigation = true,
  customNavigation,
  className,
}: NavbarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.app.theme);

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { handleLogout } = useAuthHook();

  return (
    <header className={cn("sticky top-0 z-50 h-auto", className)}>
      <div className="fade-bottom bg-background/15 absolute left-0 h-18 w-full backdrop-blur-lg"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NavbarComponent>
          <NavbarLeft className="flex items-center gap-3 flex-none">
            <Link to={homeUrl}>
              <img
                src="/logos/logo-transparent.png"
                alt="SS HR"
                width={40}
                height={40}
                className="size-10 cursor-pointer"
              />
            </Link>
            <a href={homeUrl} className="items-center gap-2 text-xl font-bold">
              {name.toUpperCase()}
            </a>
            <div className="hidden lg:flex flex-1 justify-center">
              {showNavigation && (customNavigation || <Navigation />)}
            </div>
          </NavbarLeft>
          <NavbarRight>
            {user && isAuthenticated ? (
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer underline-offset-4 hover:underline">
                      <span className="font-semibold text-sm">
                        {user?.fullName?.split(" ")[0]}
                      </span>
                      {user.profileImage ? (
                        <img
                          src={user.profileImage || noprofileImage}
                          alt="Profile"
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
                        />
                      ) : (
                        <UserCircle className="size-8" />
                      )}
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-40"
                    align="end"
                    sideOffset={8}
                  >
                    {user.role === "user" && (
                      <DropdownMenuItem asChild>
                        <Link to="/user">Dashboard</Link>
                      </DropdownMenuItem>
                    )}

                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link to="/ss-hr-admin">Dashboard</Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button variant="default" asChild className="hidden md:block">
                <a href="/login">Sign In</a>
              </Button>
            )}

            <Button
              variant="ghost"
              className="relative flex rounded-full cursor-pointer bg-0"
              onClick={() => dispatch(toggleTheme())}
            >
              {theme === "dark" ? (
                <Sun className="size-6" />
              ) : (
                <Moon className="size-6" />
              )}
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 lg:hidden"
                >
                  <Menu className="size-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="grid gap-6 text-lg font-medium">
                  <a
                    href={homeUrl}
                    className="flex items-center gap-2 text-xl font-bold"
                  >
                    <span>{name}</span>
                  </a>
                  {navLinks
                    .filter(
                      (link) =>
                        link.isForMob &&
                        (!isAuthenticated ||
                          (link.text !== "SignIn" && link.text !== "SignUp")),
                    )
                    .map((link, index) => (
                      <a
                        key={index}
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {link.text}
                      </a>
                    ))}
                </nav>
              </SheetContent>
            </Sheet>
          </NavbarRight>
        </NavbarComponent>
      </div>
    </header>
  );
};

export default Header;
