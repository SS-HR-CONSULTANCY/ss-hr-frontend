import type { LucideIcon } from "lucide-react";

export interface FooterLink {
  text: string;
  href: string;
  icon?: LucideIcon;
}

export interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  name?: string;
  columns?: FooterColumnProps[];
  copyright?: string;
  className?: string;
  address?: string;
}
