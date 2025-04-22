import { SectionContainer } from "@/components/layout/section.layout";
import { Button } from "@/components/ui/button";
import { H1, H5 } from "@/components/ui/typography";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <SectionContainer className="">
      <div className="flex max-w-[40%] flex-col gap-6">
        <div className="flex flex-col gap-6">
          <H1 className="text-primary-800 font-bold">
            Kelola Kegiatan. Tanpa Repot.
          </H1>
          <H5>
            Kelola data, agenda, dan aktivitas fakultas dengan sistem yang
            efisien dan andal
          </H5>
        </div>
        <Button className="max-w-[40%] font-semibold">
          <span>Cek Event Fakultas</span>
          <ArrowRight />
        </Button>
      </div>
      <div className="relative w-full">
        <Image
          src={"/landing-page-1.png"}
          alt="profesor menagajar"
          width={587}
          height={394}
          className="absolute -right-8 -bottom-28 w-1/2"
        />
      </div>
    </SectionContainer>
  );
}
