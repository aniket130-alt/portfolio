import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { getContent } from "@/lib/content";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const { text: t, profile } = await getContent();
  const title = t.seo_title.trim() || [profile.name, profile.role].filter(Boolean).join(" | ");
  const description = t.seo_description.trim() || profile.intro || profile.about || "";
  return {
    title,
    description,
    authors: profile.name ? [{ name: profile.name }] : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: profile.name || undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const viewport: Viewport = { themeColor: "#07101e", colorScheme: "dark" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
