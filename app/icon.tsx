import { ImageResponse } from "next/og";
import { getContent } from "@/lib/content";
import { getTheme } from "@/lib/themes";

// Favicon generated from the initials in Admin → Profile (no hardcoded letters).
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  const { profile, text } = await getContent();
  const theme = getTheme(text.theme);
  const initials = (profile.initials || profile.name.split(/\s+/).map((w) => w[0] ?? "").join(""))
    .slice(0, 3)
    .toUpperCase();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 14,
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentStrong})`,
          color: theme.onAccent,
          fontSize: initials.length > 2 ? 22 : 30,
          fontWeight: 800,
          letterSpacing: -1,
        }}
      >
        {initials}
      </div>
    ),
    size
  );
}
