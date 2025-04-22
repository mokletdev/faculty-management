"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import ButtonLink from "./button-link";
import HamburgerIcon from "../icons/hamburger";
import { useState } from "react";
import { cn } from "@/lib/utils";
import CrossIcon from "../icons/cross";
import { signIn } from "next-auth/react";

const navbarItems = [
  { name: "Beranda", href: "/" },
  { name: "Agenda", href: "/agenda" },
  { name: "FAQ", href: "/faq" },
];

export default function Navbar() {
  const [isExpanded, setExpanded] = useState(false);
  const currPath = usePathname();
  const isActive = (path: string) => {
    return currPath === path;
  };

  return (
    <>
      <nav className="fixed z-[9999] w-full">
        <div className="z-[9999] flex w-full items-center justify-between bg-white px-5 py-8 sm:px-[52px] xl:px-[124px] xl:py-[38px]">
          <Image
            src={"/ub.png"}
            alt="logo universitas brawijaya"
            width={205}
            height={57}
            className={cn(
              "h-full transition-all duration-300",
              isExpanded && "translate-x-1/2",
            )}
          />
          <div className="hidden items-center justify-between gap-[61px] xl:flex">
            <div className="flex gap-8">
              {navbarItems.map((item) => (
                <ButtonLink
                  key={item.name}
                  href={item.href}
                  isActive={isActive(item.href)}
                >
                  {item.name}
                </ButtonLink>
              ))}
            </div>
            <Button onClick={() => signIn()}>Login</Button>
          </div>
          <button
            className="block xl:hidden"
            onClick={() => setExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <CrossIcon className="text-primary-800" />
            ) : (
              <HamburgerIcon className="text-primary-800" />
            )}
          </button>
        </div>
        <div
          className={cn(
            "absolute left-0 -z-[999] flex w-full flex-col items-center gap-10 bg-white px-5 py-[40px] transition-all duration-300 sm:px-[52px] xl:hidden",
            isExpanded ? "top-[120px]" : "-top-[500px]",
          )}
        >
          <div className="flex flex-col items-center gap-8">
            {navbarItems.map((item) => (
              <ButtonLink
                key={item.name}
                href={item.href}
                isActive={isActive(item.href)}
              >
                {item.name}
              </ButtonLink>
            ))}
          </div>
          <Button className="w-full" onClick={() => signIn()}>
            Login
          </Button>
        </div>
      </nav>
    </>
  );
}
