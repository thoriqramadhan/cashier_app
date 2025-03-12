import { getTax, updateTax } from "@/helper/db/tax";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const taxResponse = await getTax()
        return NextResponse.json(taxResponse , {status: 200}) 
    } catch (error) {
        console.log(error)
        return NextResponse.json(error.message , {status: 400}) 
        
    }
}
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json()
        const { tax } = body
        await updateTax(tax)
        return NextResponse.json('success' ,{ status:200})
    } catch (error) {
        return NextResponse.json('success' ,{ status:400})
        
    }
}