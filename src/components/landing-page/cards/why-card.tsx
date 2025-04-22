import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { JSX, MouseEventHandler } from "react";

interface CardProp {
  icon: JSX.Element;
  headline: string;
  body: string;
  className?: string;
}

export default function WhyCard({ body, headline, icon, className }: CardProp) {
  return (
    <figure
      className={cn(
        "flex flex-col gap-[13px] rounded-[34px] bg-white p-9 drop-shadow-xl/25 drop-shadow-black",
        className,
      )}
    >
      <div className="bg-primary-100 text-primary-800 inline-flex aspect-square max-w-[100px] items-center justify-center rounded-[12px] p-6">
        {icon}
      </div>
      <Typography
        variant={"h4"}
        weight={"bold"}
        className="text-primary-800 max-w-[90%] text-2xl"
      >
        {headline}
      </Typography>
      <Typography variant={"body-base"} weight={"regular"}>
        {body}
      </Typography>
    </figure>
  );
}
