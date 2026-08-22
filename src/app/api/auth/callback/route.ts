import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken } from "@/lib/yahoo";

function htmlPage(title: string, body: string) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>${title}</title>
<style>
  body { font-family: ui-monospace, monospace; background: #0f0d0c; color: #f5efe0; max-width: 640px; margin: 60px auto; padding: 0 20px; line-height: 1.5; }
  h1 { color: #d4af37; font-size: 18px; }
  code, pre { background: #1c1917; padding: 2px 6px; border-radius: 4px; word-break: break-all; white-space: pre-wrap; }
  pre { padding: 12px; }
</style></head>
<body><h1>${title}</h1>${body}</body></html>`;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error) {
    return new NextResponse(htmlPage("Yahoo auth error", `<p>${error}</p>`), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }
  if (!code) {
    return new NextResponse(htmlPage("Missing code", "<p>No authorization code in callback.</p>"), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  try {
    const tokens = await exchangeCodeForToken(code);
    return new NextResponse(
      htmlPage(
        "Yahoo authorized",
        `<p>Copy the refresh token below into <code>YAHOO_REFRESH_TOKEN</code> (Vercel project env vars and your local <code>.env.local</code>). It doesn't expire until you revoke access, so this is a one-time step.</p>
        <pre>${tokens.refresh_token}</pre>
        <p>Access token (short-lived, expires in ${tokens.expires_in}s - not needed, the data-fetch script will mint new ones from the refresh token):</p>
        <pre>${tokens.access_token}</pre>`
      ),
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (err) {
    return new NextResponse(
      htmlPage("Token exchange failed", `<pre>${err instanceof Error ? err.message : String(err)}</pre>`),
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}
