import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { getContent } from "@/lib/content";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const { text: t, profile } = await getContent();
  return {
    title: t.seo_title,
    description: t.seo_description,
    authors: [{ name: profile.name }],
    openGraph: {
      title: t.seo_title,
      description: t.seo_description,
      type: "website",
      siteName: profile.name,
    },
    twitter: { card: "summary_large_image", title: t.seo_title, description: t.seo_description },
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
