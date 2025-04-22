import { SectionContainer } from "@/components/layout/section.layout";
import { Button } from "@/components/ui/button";
import { H1, H5 } from "@/components/ui/typography";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <SectionContainer id="hero">
      <div className="flex w-full flex-col items-center justify-between sm:flex-col-reverse xl:flex-row">
        <div className="flex flex-col items-center gap-6 sm:max-w-[75%] xl:max-w-[40%] xl:items-start">
          <div className="flex flex-col gap-6">
            <H1 className="text-primary-800 text-center font-bold xl:text-start">
              Kelola Kegiatan. Tanpa Repot.
            </H1>
            <H5 className="text-center xl:text-start">
              Kelola data, agenda, dan aktivitas fakultas dengan sistem yang
              efisien dan andal
            </H5>
          </div>
          <Image
            src={"/landing-page-1.png"}
            alt="profesor menagajar"
            width={587}
            height={394}
            className="mb-0 block w-[80%] sm:mb-11 sm:hidden xl:mb-0 xl:w-1/2"
          />
          <Button className="max-w-[40%] font-semibold">
            <span>Cek Event Fakultas</span>
            <ArrowRight />
          </Button>
        </div>
        <Image
          src={"/landing-page-1.png"}
          alt="profesor menagajar"
          width={587}
          height={394}
          className="mb-0 hidden w-[60%] sm:mb-11 sm:block xl:mb-0 xl:w-1/2"
        />
      </div>
    </SectionContainer>
  );
}
