import type { ButtonProps } from "@/components/ui/button";
import type { ReactNode } from "react";

// Header compoenent types
export interface NavbarLink {
  text: string;
  href: string;
}

export interface NavbarActionProps {
  text: string;
  href: string;
  variant?: ButtonProps["variant"];
  icon?: ReactNode;
  iconRight?: ReactNode;
  isButton?: boolean;
}

export interface NavbarProps {
  logo?: ReactNode;
  name?: string;
  homeUrl?: string;
  mobileLinks?: NavbarLink[];
  actions?: NavbarActionProps[];
  showNavigation?: boolean;
  customNavigation?: ReactNode;
  className?: string;
}

export interface SiteUrlConfigProps {
  home: string;
  aboutUs: string;
  packages: string;
  reviews: string;
  contact: string;
  services: string;
  signIn: string;
  signUp: string;
}

export interface navLinkProps {
  text: string;
  href: string;
  isLink?: boolean;
  content?: React.ReactNode;
  isForDesk?: boolean;
  isForMob?: boolean;
}