import {
  Footer as FooterNew,
  FooterBottom,
  FooterColumn,
  FooterContent,
} from "@/components/ui/footer";
import { MapPin } from "lucide-react";

import type { FooterProps } from "@/types/componentTypes/footerTypes";
import logoImage from "../../assets/logos/brand-icon.png";

import {
  companyName,
  footerAddress,
  footerCopyright,
  footerData,
} from "@/utils/constants";

const Footer = ({
  name = companyName,
  columns = footerData,
  copyright = footerCopyright,
  className,
  address = footerAddress,
}: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const copyrightText = copyright.replace("2025", currentYear.toString());

  return (
    <footer className={`w-full bg-zinc-100 dark:bg-zinc-900 ${className}`}>
      <FooterNew className="max-w-7xl mx-auto px-4 md:px-0 bg-zinc-100 dark:bg-zinc-900">
        <FooterContent className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-4">
          {/* Social Media and Contacts from footerData */}
          {columns.map((column, index) => (
            <FooterColumn key={index} className="md:w-1/4">
              <h3 className="text-md pt-1 font-semibold">{column.title}</h3>
              {column.links.map((link, linkIndex) => (
                <a
                  key={linkIndex}
                  href={link.href}
                  className="flex items-center gap-2 text-muted-foreground text-sm hover:text-black dark:hover:text-white"
                >
                  {link.icon && <link.icon className="size-3.5 shrink-0" />}
                  {link.text}
                </a>
              ))}
            </FooterColumn>
          ))}

          {/* Address Column */}
          <FooterColumn className="md:w-1/4">
            <div className="flex flex-col">
              <h3 className="text-md pt-1 font-semibold">Address</h3>
              <h6 className="text-muted-foreground text-sm mt-4 text-justify">
                {address}
              </h6>
              <a
                href="https://maps.app.goo.gl/mtS27W7FQJnYHbLPA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex mt-4 items-center gap-2 text-sm text-muted-foreground hover:text-black dark:hover:text-white"
              >
                <MapPin className="size-4" /> Google Map
              </a>
            </div>
          </FooterColumn>

          {/* Logo Column */}
          <FooterColumn className="md:w-1/4 flex items-center md:items-end justify-center">
            <div className="flex items-center flex-col justify-center space-y-4">
              <img
                src={logoImage}
                alt="SS HR"
                className="size-20 cursor-pointer"
              />
              <h3 className="text-xl font-bold text-center">{name}</h3>
            </div>
          </FooterColumn>
        </FooterContent>
        <FooterContent className="w-full justify-center overflow-hidden md:py-10 hidden">
          <h1
            className="
      font-extrabold 
      text-center 
      leading-none 
      text-transparent 
      stroke-text
      text-9xl
      whitespace-nowrap
    "
            style={{
              wordSpacing: "0.1em",
              transformOrigin: "center",
            }}
          >
            <span className="stroke-text">SHAHALAMGROUPS</span>
          </h1>
        </FooterContent>
        <FooterBottom className="border-t">
          <div>{copyrightText}</div>
        </FooterBottom>
      </FooterNew>
    </footer>
  );
};

export default Footer;
