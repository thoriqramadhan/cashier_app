import { addLeaveAttendanceRequest, checkUserRequestLimit, getAllAttendaceRequests, updateLeaveAttendance } from "@/helper/db/leave_attendance";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const body = await req.json();
        const { clientData } = body 
        const postResponse = await addLeaveAttendanceRequest(clientData)
        
        if(postResponse.status == 400) throw new Error(postResponse.message)
        // TODO cek user sudah berapa kali request max 1 per hari
        
        return Response.json(clientData , {status:200})
    } catch (error) {
        return Response.json(error.message , {status:400})
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const option = searchParams.get('option') as 'check_limit' || 'getAll' 
        if (option == 'check_limit') {
            const userId = searchParams.get('userId')
            if(!userId) throw new Error('User id is undefined')
            const date = searchParams.get('date')
            if (!date) throw new Error('Date id is undefined')
            const limitResponse = await checkUserRequestLimit(userId, date)
            let status = true;
            if (limitResponse.data.length === 0) status = false;
            return Response.json({ status, data: limitResponse.data[0]} , {status: 200})
        } else if (option === 'getAll') {
            const getResponses = await getAllAttendaceRequests()
            return Response.json(getResponses , {status:200})
        }
    } catch (error) {
        return Response.json("Test" , {status:400})
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json()
        const { id, status, adminMsg } = body
        const pathcResponse = await updateLeaveAttendance(status , id , adminMsg)
        return NextResponse.json({status , adminMsg} , {status: 200})
    } catch (error) {
        console.log(error);
        
        return NextResponse.json('Failed to update' , {status: 400})
        
    }
}