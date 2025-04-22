import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "../icons/arrows";
import FacebookIcon from "../icons/facebook";
import SMSIcon from "../icons/sms";
import WhatsappIcon from "../icons/whatsapp";
import { Button } from "./button";
import { H6, Typography } from "./typography";

const footerItems = [
  { name: "Beranda", href: "/" },
  { name: "Agenda", href: "/agenda" },
  { name: "FAQ", href: "/faq" },
];

const socialMedia = [
  { name: "Whatsapp", icon: <WhatsappIcon />, href: "https://wa.me/6269" },
  { name: "Facebook", icon: <FacebookIcon />, href: "https://facebook.com/" },
  { name: "Email", icon: <SMSIcon />, href: "https://mail.com/" },
];

export default function Footer() {
  return (
    <footer className="bg-primary-100 flex w-full items-start justify-between px-5 py-[51px] sm:px-[52px] sm:py-[52px] xl:px-[138px] xl:py-16">
      <div className="flex h-auto w-full flex-col items-start justify-between gap-[72px] xl:h-[244px] xl:flex-row xl:gap-0">
        <div className="flex h-full w-full flex-col items-start justify-between gap-[22px] xl:w-1/5 xl:gap-0">
          <Image
            src={"/ub.png"}
            alt="logo universitas brawijaya"
            width={184}
            height={51}
          />
          <H6>&copy; 2025 Lorem Ipsum</H6>
        </div>
        <div className="flex w-full flex-col justify-between gap-8 xl:w-1/5 xl:items-center">
          <Typography variant={"body-lg"} weight={"bold"}>
            Faculty Event Management
          </Typography>
          <div className="flex flex-col gap-8 xl:flex-row">
            {footerItems.map((i) => (
              <Button key={i.name} variant={"ghost"} asChild>
                <Link href={i.href} className="w-fit">
                  {i.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
        <div className="flex h-full w-full flex-col items-start gap-8 xl:w-1/5">
          <div className="flex gap-3">
            {socialMedia.map((i) => (
              <Button key={i.name} variant={"ghost"} asChild>
                <Link target="_blank" href={i.href} className="h-6 w-6">
                  {i.icon}
                </Link>
              </Button>
            ))}
          </div>
          <Button variant={"ghost"} asChild>
            <Link href="mailto:loremipsum@gmail.com">
              <span className="inline-flex items-center gap-2">
                loremipsum@gmail.com
                <ArrowRight />
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
