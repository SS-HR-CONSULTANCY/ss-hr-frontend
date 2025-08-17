import React from 'react';
import {
  NavbarLeft,
  NavbarRight,
  Navbar as NavbarComponent,
} from "@/components/ui/navbar";
import { cn } from "@/lib/utils";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useAppSelector } from '@/hooks/redux';
import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/ui/navigation";
import { toggleTheme } from '@/store/slices/appSlice';
import type { AppDispatch, RootState } from '@/store/store';
import { siteUrlConfig, mobileLinks } from "@/utils/constants";
import type { NavbarProps } from '@/types/omponentTypes/header';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";


const Header: React.FC = ({
  name = "ShahaalamGroups",
  homeUrl = siteUrlConfig.home,
  actions = [
    { text: "Sign in", href: siteUrlConfig.signIn, isButton: true },
  ],
  showNavigation = true,
  customNavigation,
  className,
}: NavbarProps) => {

  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.app.theme);

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <header className={cn("sticky top-0 z-50 h-auto", className)}>
      <div className="fade-bottom bg-background/15 absolute left-0 h-16 w-full backdrop-blur-lg"></div>
      <div className="relative max-w-7xl mx-auto">
        <NavbarComponent>
          <NavbarLeft>
            <a href={homeUrl} className="items-center gap-2 text-xl font-bold" >{name}</a>
            {showNavigation && (customNavigation || <Navigation />)}
          </NavbarLeft>
          <NavbarRight>
            {actions
              .filter((action) => !isAuthenticated || (action.text !== "Sign in" && action.text !== "Sign up"))
              .map((action, index) =>
                action.isButton ? (
                  <Button
                    key={index}
                    variant={action.variant || "default"}
                    asChild
                    className='hidden md:block'
                  >
                    <a href={action.href}>
                      {action.icon}
                      {action.text}
                      {action.iconRight}
                    </a>
                  </Button>
                ) : (
                  <a
                    key={index}
                    href={action.href}
                    className="hidden text-sm md:block"
                  >
                    {action.text}
                  </a>
                ),
              )}

            <div className="relative flex rounded-full cursor-pointer mx-3" onClick={() => dispatch(toggleTheme())}>
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
                  {mobileLinks
                    .filter((link) => !isAuthenticated || (link.text !== "SignIn" && link.text !== "SignUp"))
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