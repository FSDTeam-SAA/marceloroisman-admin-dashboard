import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequestWithAuth } from "next-auth/middleware"
import { AUTH_CONFIG } from "@/auth/config"

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const { pathname } = request.nextUrl
    const token = request.nextauth.token

    if (AUTH_CONFIG.PUBLIC_ROUTES.includes(pathname) && token) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        if (AUTH_CONFIG.PUBLIC_ROUTES.includes(pathname)) {
          return true
        }

        return !!token
      },
    },
    pages: {
      signIn: "/login",
    },
  },
)

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
