import { renderBrandOg } from "@/lib/og";

// Next auto-wires this route into <meta property="og:image"> with the correct
// absolute URL, width, height, and type. See src/lib/og.tsx for the design.
export { alt, size, contentType } from "@/lib/og";

export default function OpengraphImage() {
  return renderBrandOg();
}
