import { createSession } from "@/lib/auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { payload } = body;
        await createSession(payload)
        return NextResponse.json(payload , {status: 200})
    } catch (error) {
        console.log(error)
        return new NextResponse('Error creating session' , {status:400})
    }
}