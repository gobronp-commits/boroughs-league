const AUTHORIZE_URL = "https://api.login.yahoo.com/oauth2/request_auth";
const TOKEN_URL = "https://api.login.yahoo.com/oauth2/get_token";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export function getAuthorizeUrl(): string {
  const params = new URLSearchParams({
    client_id: requireEnv("YAHOO_CLIENT_ID"),
    redirect_uri: requireEnv("YAHOO_REDIRECT_URI"),
    response_type: "code",
    language: "en-us",
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
};

function basicAuthHeader(): string {
  const id = requireEnv("YAHOO_CLIENT_ID");
  const secret = requireEnv("YAHOO_CLIENT_SECRET");
  return "Basic " + Buffer.from(`${id}:${secret}`).toString("base64");
}

export async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      redirect_uri: requireEnv("YAHOO_REDIRECT_URI"),
      code,
    }),
  });
  if (!res.ok) {
    throw new Error(`Yahoo token exchange failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      redirect_uri: requireEnv("YAHOO_REDIRECT_URI"),
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) {
    throw new Error(`Yahoo token refresh failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

const FANTASY_BASE = "https://fantasysports.yahooapis.com/fantasy/v2";

// Fetches a Fantasy Sports API resource (path relative to FANTASY_BASE) as XML
// text using a valid access token. Yahoo's Fantasy API returns XML by default;
// pass format=json in the path to get JSON instead.
export async function fetchFantasyResource(path: string, accessToken: string): Promise<string> {
  const res = await fetch(`${FANTASY_BASE}/${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`Yahoo Fantasy API request failed: ${res.status} ${await res.text()}`);
  }
  return res.text();
}
