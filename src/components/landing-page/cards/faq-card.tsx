import MinusIcon from "@/components/icons/minus";
import PlusIcon from "@/components/icons/plus";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { MouseEventHandler } from "react";

interface CardProp {
  isExpanded: boolean;
  header: string;
  body: string;
  onClick?: MouseEventHandler<HTMLElement>;
}

export default function FAQCard({
  isExpanded,
  body,
  header,
  onClick,
}: CardProp) {
  return (
    <figure
      onClick={onClick}
      className={cn(
        "flex w-full gap-8 overflow-hidden rounded-lg bg-white p-6 drop-shadow-xl/25 drop-shadow-black transition-all duration-300 hover:cursor-pointer",
        isExpanded ? "max-h-[300px]" : "max-h-[76px]",
      )}
    >
      {isExpanded ? (
        <MinusIcon className="text-primary-800 aspect-square w-7" />
      ) : (
        <PlusIcon className="text-primary-800 aspect-square w-7" />
      )}
      <div className={cn("flex flex-col gap-5")}>
        <Typography weight={"bold"} variant={"body-xl"}>
          {header}
        </Typography>
        {
          <Typography weight={"regular"} variant={"body-base"}>
            {body}
          </Typography>
        }
      </div>
    </figure>
  );
}
