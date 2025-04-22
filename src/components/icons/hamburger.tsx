import { cn } from "@/lib/utils";

export default function HamburgerIcon({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <svg
      width="37"
      height="37"
      viewBox="0 0 37 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <path
        d="M6.61523 8.25928H30.9228"
        stroke="currentColor"
        strokeWidth="3.6574"
        strokeLinecap="round"
      />
      <path
        d="M6.61523 18.5H30.9228"
        stroke="currentColor"
        strokeWidth="3.6574"
        strokeLinecap="round"
      />
      <path
        d="M6.61523 28.7407H30.9228"
        stroke="currentColor"
        strokeWidth="3.6574"
        strokeLinecap="round"
      />
    </svg>
  );
}
