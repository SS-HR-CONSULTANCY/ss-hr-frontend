import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, UserCircle, ChevronDown } from "lucide-react";
import useAuthHook from "@/hooks/useAuthHook";
import { useAppSelector } from "@/hooks/redux";
import { navLinks, companyName, siteUrlConfig } from "@/utils/constants";
import logoImage from "../../assets/logos/brand-icon.png";
import noprofileImage from "../../assets/defaultImgaes/noProfile.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { handleLogout } = useAuthHook();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => location.pathname === href || location.hash === href;

  const desktopLinks = navLinks.filter((l) => l.isForDesk);

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: "white",
        borderBottom: scrolled
          ? "1px solid rgba(0,0,0,0.08)"
          : "1px solid rgba(0,0,0,0.04)",
        boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20">
        <div className="flex items-center justify-between h-20">
          {/* ─── LOGO ─── */}
          <Link to={siteUrlConfig.home} className="flex items-center gap-3 flex-shrink-0">
            <img
              src={logoImage}
              alt="SS HR"
              className="w-10 h-10 object-contain"
            />
            <span className="hidden sm:block font-black text-[#0C0C0C] tracking-tight text-sm whitespace-nowrap">
              SS HR CONSULTANCY
            </span>
          </Link>

          {/* ─── DESKTOP NAV ─── */}
          <nav className="hidden md:flex items-center gap-7">
            {desktopLinks
              .filter((l) => l.text !== "Services" || l.isForDesk)
              .filter((l, i, arr) => arr.findIndex((x) => x.text === l.text) === i)
              .map((link) => (
                <a
                  key={link.text}
                  href={link.href}
                  className="text-[14px] font-semibold transition-colors duration-200 py-1 relative"
                  style={{
                    color: isActive(link.href) ? "#D4820A" : "#4B4B4B",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#D4820A";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = isActive(link.href)
                      ? "#D4820A"
                      : "#4B4B4B";
                  }}
                >
                  {link.text}
                  {isActive(link.href) && (
                    <span
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "#febc04" }}
                    />
                  )}
                </a>
              ))}
          </nav>

          {/* ─── RIGHT ACTIONS ─── */}
          <div className="hidden md:flex items-center gap-3">
            {/* WhatsApp */}
            <a
              href="https://wa.me/971542326584"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-500 transition-colors px-3 py-2 rounded-xl hover:bg-green-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="hidden lg:inline">+971 54 232 6584</span>
            </a>

            {user && isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-full transition-all hover:bg-neutral-100">
                    <span className="font-semibold text-sm text-[#0C0C0C]">
                      {user?.fullName?.split(" ")[0]}
                    </span>
                    {user.profileImage ? (
                      <img
                        src={user.profileImage || noprofileImage}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border-2"
                        style={{ borderColor: "#febc04" }}
                      />
                    ) : (
                      <UserCircle className="size-8 text-neutral-500" />
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="end" sideOffset={8}>
                  {user.role === "user" && (
                    <DropdownMenuItem asChild>
                      <Link to="/user">Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/ss-hr-admin">Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  to="/register"
                  className="text-[14px] font-semibold text-[#0C0C0C] border rounded-full px-5 py-2 transition-all hover:bg-neutral-50"
                  style={{ borderColor: "rgba(0,0,0,0.12)" }}
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="text-[14px] font-semibold rounded-full px-5 py-2 transition-all"
                  style={{
                    background: "#febc04",
                    color: "#261900",
                    boxShadow: "0 8px 20px rgba(254,188,4,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 12px 28px rgba(254,188,4,0.4)";
                    (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 8px 20px rgba(254,188,4,0.25)";
                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                  }}
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* ─── MOBILE HAMBURGER ─── */}
          <button
            className="flex md:hidden p-2 rounded-xl text-[#0C0C0C] transition-all hover:bg-neutral-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ─── MOBILE MENU ─── */}
      {mobileOpen && (
        <div
          className="md:hidden absolute top-full left-0 w-full z-50"
          style={{
            background: "white",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          }}
        >
          <nav className="max-w-[1440px] mx-auto px-5 py-6 flex flex-col gap-4">
            {navLinks
              .filter((l) => l.isForMob)
              .filter((l, i, arr) => arr.findIndex((x) => x.text === l.text) === i)
              .map((link) => (
                <a
                  key={link.text}
                  href={link.href}
                  className="text-base font-semibold text-neutral-700 hover:text-[#D4820A] transition-colors py-1"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.text}
                </a>
              ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-neutral-100">
              {user && isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="text-sm font-bold px-5 py-3 rounded-xl text-center"
                  style={{ background: "#febc04", color: "#261900" }}
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="text-sm font-semibold text-center px-5 py-3 rounded-xl border border-neutral-200 text-[#0C0C0C]"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="text-sm font-black text-center px-5 py-3 rounded-xl"
                    style={{ background: "#febc04", color: "#261900" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
