import { cn } from "@/lib/utils";

export default function MinusIcon({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="29"
      viewBox="0 0 28 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.3333 15.6666L4.66667 15.6666C4.02233 15.6666 3.5 15.1443 3.5 14.4999C3.5 13.8556 4.02233 13.3333 4.66667 13.3333L23.3333 13.3333C23.9777 13.3333 24.5 13.8556 24.5 14.4999C24.5 15.1443 23.9777 15.6666 23.3333 15.6666Z"
        fill="currentColor"
      />
    </svg>
  );
}
