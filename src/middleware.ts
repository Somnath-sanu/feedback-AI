import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

//?The most simple usage is when you want to require authentication for your entire site. You can add a middleware.js file with the following:
// export { default } from "next-auth/middleware";

export async function middleware(reqeust: NextRequest) {
  const token = await getToken({ req: reqeust });
  console.log(token);
  
  const url = reqeust.nextUrl;
  console.log("URL :" , url);
  

  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname.startsWith("/"))
  ) {
    return NextResponse.redirect(new URL("/", reqeust.url));
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", reqeust.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/verify/:path*"],
};
