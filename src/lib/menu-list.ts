import {
  CalendarDays,
  LayoutGrid,
  Settings,
  SquarePen,
  Tag,
  Users,
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
      groupLabel: "Schedule",
      menus: [
        {
          href: "",
          label: "Agendas",
          icon: SquarePen,
          submenus: [
            {
              href: "/admin/agenda",
              label: "Agendas Overview",
            },
            {
              href: "/admin/agenda/new",
              label: "New Agenda",
            },
          ],
        },
        {
          href: "/admin/calendar",
          label: "Calendar",
          icon: CalendarDays,
        },
      ],
    },
  ];
}
