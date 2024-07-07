import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

//?The most simple usage is when you want to require authentication for your entire site. You can add a middleware.js file with the following:
// export { default } from "next-auth/middleware";

export async function middleware(reqeust: NextRequest) {
  const token = await getToken({ req: reqeust });
  console.log("Middleware-Token :", token);
  /**
   * Middleware-Token : {
   sub: '668059ad1de9ee6cdfef7161',
   _id: '668059ad1de9ee6cdfef7161',
   isVerified: true,
   username: 'sanu',
   iat: 1719688586,
   exp: 1722280586,
   jti: '3a886196-c3f4-428d-8b98-3452db074bb9'
   email: 'somnathmishra100dbi@gmail.com',
} 
*/

  const url = reqeust.nextUrl;
  //* gives object having different properties

  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/", reqeust.url));
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", reqeust.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/verify/:path*", "/dashboard"],
};

/**
   console.log("URL :", url);
   * 
   * URL : {
  href: 'http://localhost:3000/sign-in',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'localhost:3000',
  hostname: 'localhost',
  port: '3000',
  pathname: '/sign-in',
  search: '',
  searchParams: URLSearchParams {  },
  hash: ''
}
   */
