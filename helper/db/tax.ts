import { query } from "@/lib/dbpool";

export async function getTax() : Promise<{status: number , data? : {value:number}[]}>{
    try {
        const response = await query('SELECT * FROM TAX WHERE id = 1')
        return {status: 200 , data: response.rows}
    } catch (error) {
        return {status: 400 }
    }
}
export async function updateTax(newValue:string) {
    try {
        await query('UPDATE tax SET value = $1 WHERE id = 1' , [newValue])
    } catch (error) {
        console.log(error)
    }
}