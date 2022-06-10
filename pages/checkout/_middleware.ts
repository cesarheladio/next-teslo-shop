import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from 'next-auth/jwt'
export async function middleware ( req:NextRequest, ev:NextFetchEvent ){


    //  const { token } = req.cookies;

// try {
//     await jwt.isValidToken ( token)
//     return NextResponse.next()
// } catch (error) {
//     const baseUrl = req.nextUrl.clone();
//     return NextResponse.redirect( `${ baseUrl.origin }/auth/login?p=${ req.page.name }`);

// }

const session = await getToken({req, secret:process.env.NEXTAUTH_SECRET})
console.log(session);
if(!session){
    const requestedPage = req.page.name
    const baseUrl = req.nextUrl.clone();
return NextResponse.redirect(`${baseUrl.origin}/auth/login?p${requestedPage}`)
}
return NextResponse.next()
}