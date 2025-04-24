import { unauthorized } from "next/navigation";

export default function ErrorPage() {
  return unauthorized();
}
