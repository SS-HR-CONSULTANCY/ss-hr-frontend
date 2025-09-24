import {
  Footer as FooterNew,
  FooterBottom,
  FooterColumn,
  FooterContent,
} from "@/components/ui/footer";
import { MapPin } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import type { FooterProps } from "@/types/componentTypes/footerTypes";
import logoTransparent from '../../assets/logos/logo-transparent.png';
import { companyName, footerAddress, footerCopyright, footerData, footerPoliciesData } from '@/utils/constants';

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
    <footer className={`w-full border-t bg-zinc-100 dark:bg-zinc-900 ${className}`}>
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
              <h6 className='text-muted-foreground text-sm mt-4 text-justify'>{address}</h6>
              <a href="https://maps.app.goo.gl/XRxwHvB2YGcXZSok7" className="flex mt-4"><MapPin /> Google Map</a>
            </div>
          </FooterColumn>
          <FooterColumn className="col-span-2 sm:col-span-3 md:col-span-1 align-end">
            <div className="flex items-center flex-col justify-center h-full space-y-4">
              <img src={logoTransparent} alt="SS HR" className="size-20 cursor-pointer" />
              <h3 className="text-xl font-bold">{name}</h3>
            </div>
          </FooterColumn>
        </FooterContent>
        <FooterContent className="w-full flex justify-center overflow-hidden md:py-10">
          <h1 className="font-extrabold text-center leading-none text-[clamp(2rem,12vw,12rem)] text-transparent stroke-text">
            <span className="stroke-text">S</span>
            <span className="stroke-text">S</span>
            <span className="stroke-text">GROUPS</span>
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
  )
}

export default Footer
