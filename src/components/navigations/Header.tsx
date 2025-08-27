import React from 'react';
import {
  NavbarLeft,
  NavbarRight,
  Navbar as NavbarComponent,
} from "@/components/ui/navbar";
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import useAuthHook from '@/hooks/useAuthHook';
import { useAppSelector } from '@/hooks/redux';
import { Menu, Moon, Sun, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/ui/navigation";
import { toggleTheme } from '@/store/slices/appSlice';
import type { AppDispatch, RootState } from '@/store/store';
import noProfileImg from '../../assets/defaultImgaes/noProfile.png';
import logoTransparent from '../../assets/logos/logo-transparent.png';
import type { NavbarProps } from '@/types/componentTypes/headerTypes';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { siteUrlConfig, navLinks, companyName, links } from "@/utils/constants";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

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

  const { handleLogout } = useAuthHook({ route: "/" });

  return (
    <header className={cn("sticky top-0 z-50 h-auto", className)}>
      <div className="fade-bottom bg-background/15 absolute left-0 h-18 w-full backdrop-blur-lg"></div>
      <div className="relative max-w-7xl mx-auto px-4 md:px-0">
        <NavbarComponent>
          
          <NavbarLeft>
            <Link to={homeUrl} >
              <img src={logoTransparent} alt="SS HR" className="size-10 cursor-pointer" />
            </Link>
            <a href={homeUrl} className="items-center gap-2 text-xl font-bold" >{name}</a>
            {showNavigation && (customNavigation || <Navigation />)}
          </NavbarLeft>
          <NavbarRight>

            {(user && isAuthenticated) ? (
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {user.profileImg ? (
                      <img
                      src={user.profileImg || noProfileImg}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-300 cursor-pointer"
                      />
                    ) : (
                      <UserCircle className='cursor-pointer' />
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40" align="end" sideOffset={8}>
                    {links.map(link => (
                      <DropdownMenuItem asChild>
                        <Link to={link.url}>{link.text}</Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                variant="default"
                asChild
                className="hidden md:block"
              >
                <a href="/login">
                  Sign In
                </a>
              </Button>
            )}

            <div className="relative flex rounded-full cursor-pointer" onClick={() => dispatch(toggleTheme())}>
              {theme === "dark" ? <Sun /> : <Moon />}
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 md:hidden"
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
                        (!isAuthenticated || (link.text !== "SignIn" && link.text !== "SignUp"))
                    )
                    .map((link, index) =>
                    (
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
  )
}

export default Header