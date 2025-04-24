"use client";
import { cn } from "@/lib/utils";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CrossIcon from "../icons/cross";
import HamburgerIcon from "../icons/hamburger";
import { Button } from "./button";
import type { Session } from "next-auth";
import { Typography } from "./typography";

const navbarItems = [
  { name: "Beranda", href: "/" },
  { name: "Agenda", href: "/agenda" },
  { name: "FAQ", href: "/faq" },
];

export default function Navbar({ session }: { session?: Session | null }) {
  const [isExpanded, setExpanded] = useState(false);
  const [isProfileViewed, setProfileViewed] = useState(false);
  const currPath = usePathname();
  const isActive = (path: string) => {
    return currPath === path;
  };

  useEffect(() => {
    if (isProfileViewed) {
      setProfileViewed(false);
    }
  }, [currPath]);

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
                <Button key={item.name} variant={"ghost"} asChild>
                  <Link href={item.href}>{item.name}</Link>
                </Button>
              ))}
            </div>
            {session ? (
              <div className="relative flex gap-4">
                <Button
                  variant={"outline"}
                  className="text-primary-800 border-primary-800 hover:text-primary-600"
                  onClick={() => setProfileViewed(!isProfileViewed)}
                >
                  Lihat Profil
                </Button>
                {isProfileViewed && (
                  <figure className="border-primary-200 absolute -bottom-28 left-0 flex aspect-[3/1] w-[242px] items-center justify-center gap-4 rounded-[12px] border bg-white px-7 py-[18px]">
                    <Image
                      src={
                        session.user.image ??
                        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                      }
                      alt={`Foto profil ${session.user.name}`}
                      width={58}
                      height={58}
                      className="h-[58px] w-[58px] rounded-full object-cover"
                      unoptimized
                    />
                    <div className="flex flex-col items-start">
                      <Typography variant={"h5"}>
                        {session.user.name}
                      </Typography>
                      <Typography variant={"body-lg"}>
                        {session.user.role}
                      </Typography>
                    </div>
                  </figure>
                )}
                <Button
                  className="bg-red-500 text-white hover:bg-red-400"
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button className="" onClick={() => signIn()}>
                Login
              </Button>
            )}
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
              <Button key={item.name} variant={"ghost"} asChild>
                <Link href={item.href}>{item.name}</Link>
              </Button>
            ))}
          </div>
          {session ? (
            <div className="mt-10 flex w-full flex-col gap-4">
              <div className="border-primary-200 flex w-full items-center justify-start gap-4 rounded-[12px] border px-7 py-[18px]">
                <Image
                  src={
                    session.user.image ??
                    "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                  }
                  alt={`Foto profil ${session.user.name}`}
                  width={58}
                  height={58}
                  className="h-[58px] w-[58px] rounded-full object-cover"
                  unoptimized
                />
                <div className="flex flex-col items-start">
                  <Typography variant={"h5"}>{session.user.name}</Typography>
                  <Typography variant={"body-lg"}>
                    {session.user.role}
                  </Typography>
                </div>
              </div>
              <Button
                className="w-full bg-red-500 text-white hover:bg-red-400"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button className="w-full" onClick={() => signIn()}>
              Login
            </Button>
          )}
        </div>
      </nav>
    </>
  );
}
