import { query } from "@/lib/dbpool";

export async function AddAttendance(userId: string, status: 'clockin' | 'clockout' ) : Promise<{status:number}>{
    try {
        const date = new Date()
        const response = await query('INSERT INTO attendance(userId , date , status) VALUES ($1 , $2 , $3)', [userId, date.toISOString(), status])
        return {status: 200}
    } catch (error) {
        console.log(error)
        return {status: 400}
    }
}

export type AttendanceInfo = {
    userId: string,
    date: Date,
    status: string
}
export async function getTodaysAttendanceInfo(userId: string) : Promise<AttendanceInfo[]>{
    try {
        const date = new Date()
        const todaysDate = date.getDate()
        console.log(userId , todaysDate)
        const response = await query('SELECT * FROM attendance WHERE userid = $1 AND EXTRACT(DAY FROM date) = $2 ORDER BY date', [userId, todaysDate.toString()])
        return response.rows;
    } catch (error) {
        console.log(error)
        return []
    }
}