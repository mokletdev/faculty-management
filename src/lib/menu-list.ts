import {
  Calendar,
  Calendar1,
  Group,
  LayoutGrid,
  User,
  type LucideIcon,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/admin",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Penjadwalan",
      menus: [
        {
          href: "",
          label: "Agenda",
          icon: Calendar,
          submenus: [
            {
              href: "/admin/agenda",
              label: "Ringkasan Agenda",
            },
            {
              href: "/admin/agenda/new",
              label: "Agenda Baru",
            },
          ],
        },
        {
          href: "",
          label: "Kalender",
          icon: Calendar1,
          submenus: [
            {
              href: "/admin/calendar",
              label: "Preview Kalender",
            },
            {
              href: "/admin/calendar-id",
              label: "Konfigurasi Google Calendar",
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Kelola Pengguna",
      menus: [
        {
          href: "",
          label: "Pengguna",
          icon: User,
          submenus: [
            {
              href: "/admin/user",
              label: "Ringkasan Pengguna",
            },
            {
              href: "/admin/user/new",
              label: "Pengguna Baru",
            },
            {
              href: "/admin/user/bulk-create",
              label: "Tambah Massal",
            },
          ],
        },
        {
          href: "/admin/group-email",
          label: "Konfigurasi Google Group",
          icon: Group,
        },
      ],
    },
  ];
}
