"use client";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CrossIcon from "../icons/cross";
import HamburgerIcon from "../icons/hamburger";
import { Button } from "./button";

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
                <Button key={item.name} asChild>
                  <Link href={item.href}>{item.name}</Link>
                </Button>
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
              <Button key={item.name} asChild>
                <Link href={item.href}>{item.name}</Link>
              </Button>
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
