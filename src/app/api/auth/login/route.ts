import { NextResponse } from "next/server";
import { getAuthorizeUrl } from "@/lib/yahoo";

export async function GET() {
  return NextResponse.redirect(getAuthorizeUrl());
}
