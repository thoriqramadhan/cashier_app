import { getTransactionRecap, getTransactionRecapByMonth } from "@/helper/db/transaction";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const year = searchParams.get('year')
        const month = searchParams.get('month')
        const dataRecapByMonth = await getTransactionRecapByMonth(`${year}` , `${month}`)
        if(dataRecapByMonth.length == 0) throw new Error('Data empty')
        return NextResponse.json(dataRecapByMonth , {status: 200})
    } catch (error) {
        console.log(error);
        return new NextResponse('Failed' , {status:500})
    }
}