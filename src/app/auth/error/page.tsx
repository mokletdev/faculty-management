import { forbidden } from "next/navigation";

export default function ErrorPage() {
  return forbidden();
}
