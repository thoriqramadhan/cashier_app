import { addLeaveType, getAllLeaveTypes } from "@/helper/db/attendance";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const body = await req.json()
        const { name } = body;
        const response = await addLeaveType(name)
        return NextResponse.json('Success' , {status: 200})
    } catch (error) {
        return NextResponse.json("Failed to add leave type", {status: 400})
        
    }
}

export async function GET() {
    try {
        const response = await getAllLeaveTypes()
        if (response.length == 0) throw new Error('Error')
            return NextResponse.json(response , {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json("Failed to add leave type", {status: 400})
    }
}