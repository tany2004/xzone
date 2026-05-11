import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "~/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;

  // Если уже на странице логина — пропускаем
  if (request.nextUrl.pathname === "/manage/login") {
    // Если уже авторизован — редиректим на дашборд
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        return NextResponse.redirect(new URL("/manage/booking", request.url));
      }
    }
    return NextResponse.next();
  }

  // Все остальные /manage/* маршруты — требуют токен
  if (!token) {
    return NextResponse.redirect(new URL("/manage/login", request.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/manage/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*"],
};