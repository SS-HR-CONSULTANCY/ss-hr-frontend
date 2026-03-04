import {
  Footer as FooterNew,
  FooterBottom,
  FooterColumn,
  FooterContent,
} from "@/components/ui/footer";
import { MapPin } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import type { FooterProps } from "@/types/componentTypes/footerTypes";
import logoImage from "../../assets/logos/brand-icon.png";

import {
  companyName,
  footerAddress,
  footerCopyright,
  footerData,
  footerPoliciesData,
} from "@/utils/constants";

const Footer = ({
  name = companyName,
  columns = footerData,
  copyright = footerCopyright,
  policies = footerPoliciesData,
  showModeToggle = true,
  className,
  address = footerAddress,
}: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const copyrightText = copyright.replace("2025", currentYear.toString());

  return (
    <footer className={`w-full bg-zinc-100 dark:bg-zinc-900 ${className}`}>
      <FooterNew className="max-w-7xl mx-auto px-4 md:px-0 bg-zinc-100 dark:bg-zinc-900">
        <FooterContent className="flex flex-col md:flex-row md:justify-between">
          {columns.map((column, index) => (
            <FooterColumn key={index}>
              <h3 className="text-md pt-1 font-semibold">{column.title}</h3>
              {column.links.map((link, linkIndex) => (
                <a
                  key={linkIndex}
                  href={link.href}
                  className="text-muted-foreground text-sm hover:text-black dark:hover:text-white"
                >
                  {link.text}
                </a>
              ))}
            </FooterColumn>
          ))}
          <FooterColumn className="col-span-2 sm:col-span-3 md:col-span-1">
            <div className="flex flex-col w-6/12">
              <h3 className="text-md pt-1 font-semibold">Address</h3>
              <h6 className="text-muted-foreground text-sm mt-4 text-justify">
                {address}
              </h6>
              <a
                href="https://www.google.com/search?client=mobilesearchapp&sca_esv=9a75789331dfae63&bih=879&biw=428&channel=iss&cs=1&hl=en&rlz=1MDAPLA_enAE1025AE1025&v=408.0.868297084&sxsrf=ANbL-n4tvpAqF6NITEcfdYy806ppEpCWKA:1771475706455&kgmid=/g/11t5b5qvy2&q=Abu+Saif+Business+center&shem=epsd1,shrtsdl&shndl=30&source=sh/x/loc/act/m1/5&kgs=d67339138e00053b&utm_source=epsd1,shrtsdl,sh/x/loc/act/m1/5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex mt-4"
              >
                <MapPin /> Google Map
              </a>
            </div>
          </FooterColumn>
          <FooterColumn className="col-span-2 sm:col-span-3 md:col-span-1 align-end">
            <div className="flex items-center flex-col justify-center h-full space-y-4">
              <img
                src={logoImage}
                alt="SS HR"
                className="size-20 cursor-pointer"
              />
              <h3 className="text-xl font-bold">{name}</h3>
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
          <div className="flex items-center gap-4">
            {policies.map((policy, index) => (
              <a key={index} href={policy.href}>
                {policy.text}
              </a>
            ))}
            {showModeToggle && <ModeToggle />}
          </div>
        </FooterBottom>
      </FooterNew>
    </footer>
  );
};

export default Footer;
