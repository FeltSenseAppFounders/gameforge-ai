import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  const isDev = process.env.NODE_ENV === "development";
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://js.stripe.com https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      `connect-src 'self' https://*.supabase.co https://api.stripe.com https://vitals.vercel-insights.com${isDev ? " http://127.0.0.1:* http://localhost:*" : ""}`,
      "frame-src 'self' blob: https://js.stripe.com",
      "img-src 'self' data: blob: https://*.stripe.com",
      "font-src 'self' https://fonts.gstatic.com",
    ].join("; ")
  );

  return response;
}

export const config = {
  matcher: [
    // Run on all routes except static files and API routes that don't need auth
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
