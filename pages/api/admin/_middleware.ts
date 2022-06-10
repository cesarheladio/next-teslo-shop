import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from 'next-auth/jwt'

export async function middleware ( req:NextRequest, ev:NextFetchEvent ){
    console.log("hola");
    
    const session:any = await getToken({req, secret:process.env.NEXTAUTH_SECRET})   
    if(!session){
        console.log("no sesion");
        
       return new Response(JSON.stringify({ message: "No authorizado"}),{
           status:401,
           headers:{
               'Content-Type':'application/json'
           }
       })
    }
    
    const validRoles=['admin', 'super-user', 'SEO']

    if(!validRoles.includes(session.user.role)){  
        console.log("eror rol");
        
        return new Response(JSON.stringify({ message: "No authorizado"}),{
            status:401,
            headers:{
                'Content-Type':'application/json'
            }
        })
    }
    console.log("paso");
    
    return NextResponse.next()
}