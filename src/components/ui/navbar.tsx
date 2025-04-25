"use client";
import { cn } from "@/lib/utils";
import { LayoutGrid, LogOut } from "lucide-react";
import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CrossIcon from "../icons/cross";
import HamburgerIcon from "../icons/hamburger";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Tooltip, TooltipProvider, TooltipTrigger } from "./tooltip";
import { Typography } from "./typography";

const navbarItems = [
  { name: "Beranda", href: "/" },
  { name: "Agenda", href: "/agenda" },
  { name: "FAQ", href: "/faq" },
];

export default function Navbar({ session }: { session?: Session | null }) {
  const [isExpanded, setExpanded] = useState(false);

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
              <DropdownMenu>
                <TooltipProvider disableHoverableContent>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="relative h-8 w-8 rounded-full"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={session?.user.image ?? "#"}
                              alt="Avatar"
                            />
                            <AvatarFallback className="bg-transparent">
                              {session?.user.name?.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                  </Tooltip>
                </TooltipProvider>

                <DropdownMenuContent
                  className="z-[9999] w-56"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm leading-none font-medium">
                        {session?.user.name ?? "Unknown"}
                      </p>
                      <p className="text-muted-foreground text-xs leading-none">
                        {session?.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  {session.user.role === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          className="hover:cursor-pointer"
                          asChild
                        >
                          <Link href={`/admin`} className="flex items-center">
                            <LayoutGrid className="text-muted-foreground mr-3 h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="hover:cursor-pointer"
                    variant="destructive"
                    onClick={() =>
                      signOut({ redirectTo: "/auth/login" }).catch((err) =>
                        console.error(err),
                      )
                    }
                  >
                    <LogOut className="mr-3 h-4 w-4 text-red-500" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
              <Link
                href={session.user.role === "ADMIN" ? "/admin" : "#"}
                className="border-primary-200 flex w-full items-center justify-start gap-4 rounded-[12px] border px-7 py-[18px]"
              >
                <Avatar className="size-14">
                  <AvatarImage src={session?.user.image ?? "#"} alt="Avatar" />
                  <AvatarFallback className="bg-transparent">
                    {session?.user.name?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <Typography variant={"h5"}>{session.user.name}</Typography>
                  <Typography variant={"body-lg"}>
                    {session.user.role}
                  </Typography>
                </div>
              </Link>
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
