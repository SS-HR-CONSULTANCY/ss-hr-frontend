export interface FooterLink {
  text: string;
  href: string;
}

export interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  name?: string;
  columns?: FooterColumnProps[];
  copyright?: string;
  policies?: FooterLink[];
  showModeToggle?: boolean;
  className?: string;
  address?: string;
}
