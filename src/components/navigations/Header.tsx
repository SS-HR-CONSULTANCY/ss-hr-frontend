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
import useAuthHook from "@/hooks/useAuthHook";
import { useAppSelector } from "@/hooks/redux";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/ui/navigation";
import { Menu, UserCircle } from "lucide-react";
import noprofileImage from "../../assets/defaultImgaes/noProfile.png";
import logoImage from "../../assets/logos/brand-icon.png";

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
                src={logoImage}
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
                <a
              href="https://wa.me/971523664492"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="flex items-center gap-1.5 text-green-500 hover:text-green-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="hidden sm:inline text-sm font-medium">+971 52 366 4492</span>
            </a>
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
