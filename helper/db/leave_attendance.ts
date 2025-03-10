import { query } from "@/lib/dbpool";

export interface LeaveAttendanceRequestData {
    user_id: number,
    leave_category: string,
    reason: string,
    leave_at: Date,
    back_at: Date
}
export async function addLeaveAttendanceRequest(clientData: LeaveAttendanceRequestData) : Promise<{status:number , message?:any}>{
    try {
        await query('INSERT INTO attendance_leave_applicant(user_id , leave_category , reason , status , leave_at , back_at ) VALUES ($1 , $2 , $3 , false ,  $4 , $5 )', [clientData.user_id.toString(), clientData.leave_category, clientData.reason, clientData.leave_at.toString(), clientData.back_at.toString()])
        return {status: 200}
    } catch (error) {
        console.log(error);
        return {status: 400 , message: error}
    }
}

export async function getAllAttendaceRequests(statusOption: boolean) {
    try {
        const response = await query('SELECT * FROM attendance_leave_applicant WHERE status = false');
        return response.rows;
    } catch (error) {
        console.log(error);
        
        return []
    }
}