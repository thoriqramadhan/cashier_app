import { getLastTransactionId } from "@/helper/db/history";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const option = searchParams.get('option') 
        if (option === 'lastId') {
            const lastTransactionData = await getLastTransactionId()
            return NextResponse.json(lastTransactionData , {status: 200})
        } else {
            throw new Error('no option provided!')
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json('Failed' , {status: 500})
    }
}