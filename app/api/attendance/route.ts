import { AddAttendance, getTodaysAttendanceInfo } from "@/helper/db/attendance"
import { getAuthInfo } from "@/lib/auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const option = searchParams.get('option') as 'clockin' | 'clockout'
        const { id } = await getAuthInfo()
        const response = await AddAttendance(id , option)

        return NextResponse.json(response , {status: 200})
    } catch (error) {
        return NextResponse.json('Failed to add' , {status: 400})
        
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const option = searchParams.get('option') as 'all' | 'userId'
        if (option == 'userId') {
            const userId = searchParams.get('userId') as string
            if(!userId) throw new Error('You need to insert userId') 
            const response = await getTodaysAttendanceInfo(userId)
            return NextResponse.json(response , {status: 200})
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json('Failed' , {status: 400})
        
    }
}