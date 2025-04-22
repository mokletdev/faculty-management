import BellIcon from "@/components/icons/bell";
import CalendarIcon from "@/components/icons/calendar";
import CheckIcon from "@/components/icons/check";
import { SectionContainer } from "@/components/layout/section.layout";
import { Typography } from "@/components/ui/typography";
import WhyCard from "../cards/why-card";

const whyCards = [
  {
    icon: <CalendarIcon />,
    headline: "Terintegrasi dengan Google Calendar",
    body: "Setiap agenda otomatis tersimpan dan terupdate di kalender Google pengguna.",
  },
  {
    icon: <BellIcon />,
    headline: "Notifikasi Otomatis ke Dosen",
    body: "Setiap perubahan atau pembatalan langsung dikirim ke email dosen terkait.",
  },
  {
    icon: <CheckIcon />,
    headline: "Anti Bentrok, Anti Bingung",
    body: "Jadwal disusun cerdas untuk menghindari tabrakan waktu dan ruangan.",
  },
];

export default function WhySection() {
  return (
    <SectionContainer id="why">
      <div className="flex w-full flex-col items-start justify-between">
        <div className="flex flex-col gap-4 xl:max-w-[55%]">
          <Typography
            variant={"h2"}
            weight={"bold"}
            className="text-primary-800 text-[40px]"
          >
            Kenapa Harus Pakai Sistem Ini?
          </Typography>
          <Typography variant={"body-base"} weight={"regular"}>
            Mengatur acara fakultas nggak harus ribet. Dengan sistem ini, semua
            agenda bisa diakses, dipantau, dan diatur dengan lebih cepat dan
            akurat.
          </Typography>
        </div>
        <div className="mt-12 flex w-full flex-col gap-[38px] xl:flex-row">
          {whyCards.map((i, n) => (
            <WhyCard
              key={n}
              body={i.body}
              headline={i.headline}
              icon={i.icon}
            />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
