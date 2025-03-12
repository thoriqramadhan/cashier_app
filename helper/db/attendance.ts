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

export async function getAllAttendanceBy(option: 'date' | 'month' | 'year' , value): Promise<AttendanceInfo[]> {
    try {
        const response = await query('SELECT * FROM attendance WHERE EXTRACT(YEAR FROM date) = 2025 AND EXTRACT(DAY FROM date) = 4')
        return response.rows;
    } catch (error) {
        return []
        console.log(error)
    }
}

export async function addLeaveType(value: string) {
    try {
        await query('INSERT INTO attendance_type(name) VALUES($1)', [value.toLowerCase()])
    } catch (error) {
        console.log(error)
    }
}

export async function getAllLeaveTypes() : Promise<{name: string}[]> {
    try {
        const response = await query('SELECT * FROM attendance_type')
        return response.rows
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function deleteLeaveType(name: string) {
    try {
        await query('DELETE FROM attendance_type WHERE name = $1', [name])
        return {status: 200}
    } catch (error) {
        return {status: 400 , statusText: error}
        
    }
}
export async function updateLeaveType(oldVal: string, newVal: string) {
    try {
        await query('UPDATE attendance_type SET name = $1 WHERE name = $2' , [newVal.toLowerCase() , oldVal])
    } catch (error) {
        console.log(error);
    }
}
