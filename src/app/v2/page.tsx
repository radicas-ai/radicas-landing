import { redirect } from "next/navigation";

// The v2 proposal became the root landing; keep old /v2 links working.
// Switch to permanentRedirect once the swap is confirmed in production.
export default function ProposalTwo() {
  redirect("/");
}
