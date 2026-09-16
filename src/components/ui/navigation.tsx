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
import { useLocation } from "react-router-dom";

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
}: NavigationProps) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <>
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
          {menuItems
            .filter((item) => item.isForDesk)
            .map((item, index) => (
              <NavigationMenuItem key={index}>
                {item.isLink ? (
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      pathname === item.href && "bg-accent text-accent-foreground"
                    )}
                    href={item.href}
                  >
                    {item.text}
                  </NavigationMenuLink>
                ) : (
                  <>
                    <NavigationMenuTrigger>{item.text}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      {item.content === "components" ? (
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {components.map((component) => (
                            <ListItem
                              key={component.title}
                              title={component.title}
                              href={component.buttonUrl}
                              onClick={(e) => {
                                if (component.buttonAction === "share_interest") {
                                  e.preventDefault();
                                  window.open(
                                    "https://wa.me/971542326584?text=Hello%2C%20I%20am%20interested%20in%20career%20opportunities%20with%20SS%20HR%20Consultancy.",
                                    "_blank"
                                  );
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
