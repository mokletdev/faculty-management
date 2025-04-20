import "@/styles/globals.css";

import { type Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Faculty Agenda Management System Brawijaya University",
  description:
    "Manage agendas and faculty events easily. Sync with Google Calendar.",
  keywords:
    "agenda, faculty, Google Calendar, events, university, academic, management",
  authors: [{ name: "MokletDev", url: "https://dev.moklet.org/" }],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${openSans.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
