import { addLeaveAttendanceRequest, getAllAttendaceRequests } from "@/helper/db/leave_attendance";
import { NextRequest } from "next/server";

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

export async function GET() {
    try {
        const getResponses = await getAllAttendaceRequests(true)
        return Response.json(getResponses , {status:200})
    } catch (error) {
        return Response.json("Test" , {status:400})
    }
}