import { renderBrandOg } from "@/lib/og";

// Next auto-wires this route into <meta name="twitter:image"> (pairs with the
// existing twitter.card = "summary_large_image"). Same design as the OG card.
export { alt, size, contentType } from "@/lib/og";

export default function TwitterImage() {
  return renderBrandOg();
}
