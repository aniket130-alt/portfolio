import { serverClient, supabaseConfigured, SUPABASE_URL } from "@/lib/supabase";

/**
 * /resume — serves the resume uploaded in Admin → Profile from this site's own URL,
 * so visitors never see the Supabase storage link. Reads the current resume link
 * straight from the database on every request, so a new upload works immediately.
 */
export async function GET() {
  if (!supabaseConfigured) return new Response("Resume not available.", { status: 404 });

  const { data } = await serverClient().from("profile").select("name, cv_url").eq("id", 1).maybeSingle();
  const src = typeof data?.cv_url === "string" ? data.cv_url.trim() : "";
  if (!src) return new Response("Resume not available.", { status: 404 });

  // Only proxy files from our own storage bucket (never act as an open proxy).
  // A resume link pasted from elsewhere (e.g. Google Drive) is redirected to instead.
  const ownBucket = `${new URL(SUPABASE_URL).origin}/storage/v1/object/public/portfolio/`;
  if (!src.startsWith(ownBucket)) {
    return /^https?:\/\//i.test(src) ? Response.redirect(src, 302) : new Response("Resume not available.", { status: 404 });
  }

  const file = await fetch(src, { cache: "no-store" });
  if (!file.ok || !file.body) return new Response("Resume not available.", { status: 502 });

  // Download name from the profile name, e.g. "Jane-Doe-Resume.pdf"
  const name = typeof data?.name === "string" ? data.name : "";
  const base = name.trim().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
  const filename = `${base ? `${base}-` : ""}Resume.pdf`;

  return new Response(file.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
