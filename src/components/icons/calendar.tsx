import { cn } from "@/lib/utils";

export default function CalendarIcon({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <svg
      width="50"
      height="52"
      viewBox="0 0 50 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <path
        d="M13.6565 0C12.1488 0 10.9252 1.22362 10.9252 2.7313C4.89174 2.7313 0 7.62305 0 13.6565V16.5571L49.1632 16.3878V13.6565C49.1632 7.62305 44.2715 2.7313 38.2381 2.7313C38.2381 1.22362 37.0145 0 35.5068 0C33.9991 0 32.7755 1.22362 32.7755 2.7313H16.3877C16.3877 1.22362 15.1641 0 13.6565 0ZM0 21.8504V40.9694C0 47.0029 4.89174 51.8946 10.9252 51.8946H38.2381C44.2715 51.8946 49.1632 47.0029 49.1632 40.9694V21.8504H0Z"
        fill="currentColor"
      />
    </svg>
  );
}
