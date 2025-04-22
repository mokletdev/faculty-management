import Image from "next/image";
import { H6, Typography } from "./typography";

export default function Footer() {
  return (
    <footer className="bg-primary-100 flex w-full items-start justify-between px-[138px] py-16">
      <div className="flex h-[244px] w-full items-start justify-between">
        <div className="flex h-full w-1/5 flex-col items-start justify-between">
          <Image
            src={"/ub.png"}
            alt="logo universitas brawijaya"
            width={184}
            height={51}
          />
          <H6>&copy;2025 Lorem Ipsum</H6>
        </div>
        <div className="flex w-1/5 flex-col items-center justify-between gap-8">
          <Typography variant={"body-lg"} weight={"bold"}>
            Faculty Event Management
          </Typography>
          <div></div>
        </div>
        <div className="flex h-full w-1/5 flex-col items-stretch justify-between"></div>
      </div>
    </footer>
  );
}
