"use client";
import { SectionContainer } from "@/components/layout/section.layout";
import { Typography } from "@/components/ui/typography";
import { useState } from "react";
import FAQCard from "../cards/faq-card";

const contents = [
  {
    header: "Kenapa Faculty Event Management System ini dibutuhkan?",
    body: "Karena kegiatan di fakultas sering kali padat dan bertumpuk, sistem ini hadir untuk menghindari bentrokan jadwal, mempermudah komunikasi, dan memastikan semua orang tahu apa yang sedang terjadi.",
  },
  {
    header: "Apakah mahasiswa bisa membuat atau mengedit agenda?",
    body: "Tidak. Mahasiswa hanya bisa melihat agenda yang sudah dibuat. Hanya Admin yang memiliki akses untuk membuat, mengedit, atau menghapus jadwal.",
  },
  {
    header: "Apakah saya bisa melihat semua agenda fakultas?",
    body: "Tergantung peran kamu. Beberapa agenda mungkin hanya bisa dilihat oleh dosen atau admin. Tapi agenda umum akan tampil di kalender dan bisa dilihat oleh semua pengguna yang relevan.",
  },
  {
    header: "Apakah jadwal di sistem ini terhubung dengan Google Calendar?",
    body: "Ya! Kalender agenda dalam sistem ini terintegrasi langsung dengan Google Calendar, sehingga pengguna dapat melihat dan mengikuti jadwal fakultas dengan mudah dari perangkat apa pun.",
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
            Beberapa pertanyaan yang sering diajukan oleh beberapa orang terkait
            dengan platform ini
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
