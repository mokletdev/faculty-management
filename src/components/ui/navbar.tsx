"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import ButtonLink from "./button-link";

const navbarItems = [
  { name: "Beranda", href: "/" },
  { name: "Agenda", href: "/agenda" },
  { name: "FAQ", href: "/faq" },
];

export default function Navbar() {
  const currPath = usePathname();
  const isActive = (path: string) => {
    return currPath === path;
  };

  return (
    <nav className="flex w-full items-center justify-between bg-white px-[124px] py-[38px]">
      <Image
        src={"/ub.png"}
        alt="logo universitas brawijaya"
        width={205}
        height={57}
        className="h-full"
      />
      <div className="flex items-center justify-between gap-[61px]">
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
        <Button>Login</Button>
      </div>
    </nav>
  );
}
