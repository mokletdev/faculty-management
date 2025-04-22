import { cn } from "@/lib/utils";

export default function PlusIcon({ className }: { className?: string }) {
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
        d="M3.5 14.4999C3.5 13.8556 4.02233 13.3333 4.66667 13.3333H23.3333C23.9777 13.3333 24.5 13.8556 24.5 14.4999C24.5 15.1443 23.9777 15.6666 23.3333 15.6666H4.66667C4.02233 15.6666 3.5 15.1443 3.5 14.4999Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.0001 4C14.6444 4 15.1667 4.52233 15.1667 5.16667L15.1667 23.8333C15.1667 24.4777 14.6444 25 14.0001 25C13.3557 25 12.8334 24.4777 12.8334 23.8333L12.8334 5.16667C12.8334 4.52233 13.3557 4 14.0001 4Z"
        fill="currentColor"
      />
    </svg>
  );
}
