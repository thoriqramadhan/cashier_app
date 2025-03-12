import { addLeaveType, deleteLeaveType, getAllLeaveTypes, updateLeaveType } from "@/helper/db/attendance";
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

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json()
        const { name } = body;
        const response = await deleteLeaveType(name)
        if (response.status == 200) {
            return NextResponse.json( name , {status: 200})
        } else {
             throw new Error(response.statusText)
        }
    } catch (error) {
        return NextResponse.json('Failed to delete : ' + error , {status: 400})
        
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json()
        const { oldState, newState } = body

        const allLeaveTypes = await getAllLeaveTypes()
        const isNewValDuplicate = allLeaveTypes.find(item => item.name == newState)
        if (isNewValDuplicate) throw new Error(`${newState} is duplicated try something else!`)
        await updateLeaveType(oldState , newState)
        return NextResponse.json({oldState , newState , isNewValDuplicate} , {status: 200})
    } catch (error) {
        return NextResponse.json({message:error.message} , {status: 400})
        
    }
}