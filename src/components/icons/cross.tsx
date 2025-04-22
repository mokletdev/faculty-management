import { cn } from "@/lib/utils";

export default function CrossIcon({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <svg
      width="37"
      height="35"
      viewBox="0 0 37 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.16004 7.73615C8.7621 7.1697 9.73823 7.1697 10.3403 7.73615L28.8404 25.1422C29.4424 25.7086 29.4424 26.6271 28.8404 27.1935C28.2383 27.76 27.2622 27.76 26.6601 27.1935L8.16004 9.78747C7.55798 9.22102 7.55798 8.30261 8.16004 7.73615Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28.8404 7.73615C28.2384 7.1697 27.2623 7.1697 26.6602 7.73615L8.16014 25.1422C7.55808 25.7086 7.55808 26.6271 8.16014 27.1935C8.7622 27.76 9.73833 27.76 10.3404 27.1935L28.8404 9.78747C29.4425 9.22102 29.4425 8.30261 28.8404 7.73615Z"
        fill="currentColor"
      />
    </svg>
  );
}
