import { SectionContainer } from "@/components/layout/section.layout";
import { Typography } from "@/components/ui/typography";
import Image from "next/image";

export default function IntroductionSection() {
  return (
    <SectionContainer id="introduction" className="bg-primary-800 text-white">
      <div className="flex w-full flex-col-reverse items-center justify-between gap-0 xl:flex-row xl:gap-[18px]">
        <div className="mt-12 flex max-w-[90%] flex-col items-center gap-4 xl:mt-0 xl:max-w-[55%] xl:items-start">
          <Typography
            weight={"bold"}
            className="text-center text-[40px] text-white xl:text-start"
          >
            Ini Dia Faculty Event Management System!
          </Typography>
          <Typography
            weight={"regular"}
            className="max-w-[85%] text-center text-[18px] text-white xl:text-start"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut iaculis
            finibus enim, vestibulum ornare felis ornare non. Vivamus tincidunt
            enim quis est fringilla, id rhoncus odio scelerisque.Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Ut iaculis finibus
            enim, vestibulum ornare felis ornare non. Vivamus tincidunt enim
            quis est fringilla, id rhoncus odio scelerisque.
          </Typography>
        </div>
        <Image
          src={"/landing-page-2.png"}
          alt="logo fems"
          width={494}
          height={472}
        />
      </div>
    </SectionContainer>
  );
}
