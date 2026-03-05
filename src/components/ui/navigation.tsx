import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu";
import * as React from "react";
import { cn } from "@/lib/utils";
import LaunchUI from "../logos/launch-ui";
import { navLinks, navServices } from "@/utils/constants";
import type { navLinkProps } from "@/types/componentTypes/headerTypes";
import { navigationMenuTriggerStyle } from "./navigation-menu-variants";
import type { ContentCardProps } from "@/types/componentTypes/servicesTypes";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NavigationProps {
  menuItems?: navLinkProps[];
  components?: ContentCardProps[];
  logo?: React.ReactNode;
  logoTitle?: string;
  logoDescription?: string;
  logoHref?: string;
  introItems?: {
    title: string;
    href: string;
    description: string;
  }[];
}

export default function Navigation({
  menuItems = navLinks,
  components = navServices,
  logo = <LaunchUI />,
  logoTitle = "Launch UI",
  logoDescription = "Landing page template built with React, Shadcn/ui and Tailwind that you can copy/paste into your project.",
  logoHref = "http://localhost:3000",
  introItems = [],
}: NavigationProps) {

  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = React.useState(false);


  return (
    <>
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
          {menuItems
            .filter(item => item.isForDesk)
            .map((item, index) => (
              <NavigationMenuItem key={index}>
                {item.isLink ? (
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), pathname === item.href && "bg-accent text-accent-foreground")}
                    asChild
                  >
                    <a href={item.href}>{item.text}</a>
                  </NavigationMenuLink>
                ) : (
                  <>
                    <NavigationMenuTrigger>{item.text}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      {item.content === "default" ? (
                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                          <li className="row-span-3">
                            <NavigationMenuLink asChild>
                              <a
                                className="from-muted/30 to-muted/10 flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                                href={logoHref}
                              >
                                {logo}
                                <h4 className="mt-4 mb-2 text-lg font-medium">
                                  {logoTitle}
                               </h4>
                                <p className="text-muted-foreground text-sm leading-tight">
                                  {logoDescription}
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </li>
                          {introItems.map((intro, i) => (
                            <ListItem key={i} href={intro.href} title={intro.title}>
                              {intro.description}
                            </ListItem>
                          ))}
                        </ul>
                      ) : item.content === "components" ? (
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {components.map((component) => (
                            <ListItem
                              key={component.title}
                              title={component.title}
                              href={component.buttonUrl}
                              onClick={(e) => {
                                if (component.buttonAction === "share_interest") {
                                  e.preventDefault();
                                  if (!isAuthenticated) {
                                    setIsOpen(true);
                                  } else {
                                    navigate("/user/jobs");
                                  }
                                }
                              }}
                            >
                              {component.description}
                            </ListItem>
                          ))}
                        </ul>
                      ) : (
                        item.content
                      )}
                    </NavigationMenuContent>
                  </>
                )}
              </NavigationMenuItem>
            ))}
        </NavigationMenuList>
      </NavigationMenu>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ready to explore careers?</AlertDialogTitle>
            <AlertDialogDescription>
              To view available vacancies and share your interest, please log in or create an account with us.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpen(false)}>Maybe Later</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setIsOpen(false);
              navigate("/login");
            }}>
              Log In
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ListItem({
  className,
  title,
  children,
  ...props
}: React.ComponentProps<"a"> & { title: string }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          data-slot="list-item"
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none",
            className,
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}
