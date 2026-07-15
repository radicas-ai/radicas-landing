import { permanentRedirect } from "next/navigation";

// The v2 proposal is now the root landing; /v2 is permanently gone (308).
export default function ProposalTwo() {
  permanentRedirect("/");
}
