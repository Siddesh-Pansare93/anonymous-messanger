import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt"

export { default } from "next-auth/middleware"
 
export async function middleware(request: NextRequest) {
    
    const token = await getToken({  req :request })

    if(token && (
        request.nextUrl.pathname.startsWith('/sign-in') ||
        request.nextUrl.pathname.startsWith('/sign-up') ||
        request.nextUrl.pathname.startsWith('/verify') ||
        request.nextUrl.pathname.startsWith('/') 
    )){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }


    return NextResponse.redirect(new URL('/sign-in', request.url))
}
 

// middleware will be applied on all the paths below 
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/' , 
    '/verify/path*',
    '/dashboard/path*',
    
],
}