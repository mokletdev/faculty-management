import { cn } from "@/lib/utils";

export function ArrowRight({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className, "!h-6 !w-6")}
    >
      <path
        d="M14.4299 5.92993L20.4999 11.9999L14.4299 18.0699"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 12H20.33"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowRightThin({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <svg
      width="22"
      height="17"
      viewBox="0 0 22 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <path
        d="M20.8995 7.7001C21.3413 8.14187 21.3413 8.85813 20.8995 9.2999L13.7004 16.499C13.2587 16.9407 12.5424 16.9407 12.1006 16.499C11.6589 16.0572 11.6589 15.3409 12.1006 14.8992L18.4998 8.5L12.1006 2.10083C11.6589 1.65906 11.6589 0.94281 12.1006 0.50104C12.5424 0.0592699 13.2587 0.0592699 13.7004 0.50104L20.8995 7.7001ZM2.00003 9.63122C1.37527 9.63122 0.868805 9.12476 0.868805 8.5C0.868805 7.87524 1.37527 7.36878 2.00003 7.36878V9.63122ZM20.0996 9.63122L2.00003 9.63122V7.36878L20.0996 7.36878V9.63122Z"
        fill="currentColor"
      />
    </svg>
  );
}
