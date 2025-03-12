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

export async function getAllAttendaceRequests(statusOption?: boolean) {
    let statusBuilder = ''
    if (!!statusOption) {
        statusBuilder = `WHERE status = ${statusOption}`
    }
    try {
        const response = await query(`SELECT * FROM attendance_leave_applicant ${statusBuilder}`);
        return response.rows;
    } catch (error) {
        console.log(error);
        
        return []
    }
}

export async function updateLeaveAttendance(status: boolean, id : string, adminMsg?: string) : Promise<{status: number}>{
    const adminMsgQuery = adminMsg && ',  message_callback = $3'
    try {
        await query(`UPDATE attendance_leave_applicant SET status = $1 ${adminMsgQuery} WHERE id = $2`, [String(status), id, adminMsg ? adminMsg : ''])
        return {status: 200}
    } catch (error) {
        console.log(error)
        return {status: 400}
        
    }
    
}