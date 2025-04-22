"use client";
import { SectionContainer } from "@/components/layout/section.layout";
import { Typography } from "@/components/ui/typography";
import { useState } from "react";
import FAQCard from "../cards/faq-card";

const contents = [
  {
    header: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut iaculis finibus enim, vestibulum ornare felis ornare non.",
  },
  {
    header: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut iaculis finibus enim, vestibulum ornare felis ornare non.",
  },
  {
    header: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut iaculis finibus enim, vestibulum ornare felis ornare non.",
  },
  {
    header: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut iaculis finibus enim, vestibulum ornare felis ornare non.",
  },
];

export default function FAQSection() {
  const [active, setActive] = useState<number | null>();

  return (
    <SectionContainer
      id="faq"
      className="to-primary-100 bg-gradient-to-b from-white"
    >
      <div className="flex flex-col items-center justify-between gap-[54px] xl:flex-row">
        <div className="flex flex-col gap-4 xl:max-w-[35%]">
          <Typography
            variant={"h2"}
            weight={"bold"}
            className="text-primary-800 text-[40px]"
          >
            Pertanyaan yang sering diajukan
          </Typography>
          <Typography variant={"body-base"} weight={"regular"}>
            Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem
            Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum
          </Typography>
        </div>
        <div className="flex w-full flex-col gap-9 sm:w-[80%] xl:w-[60%]">
          {contents.map((i, n) => (
            <FAQCard
              body={i.body}
              key={n}
              header={i.header}
              isExpanded={n === active}
              onClick={() => (active === n ? setActive(null) : setActive(n))}
            />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
