import { query } from "@/lib/dbpool";
import { TransactionRecap } from "@/types/transaction";

export async function getTransactionRecap(year: string, month?: string, date?: string): Promise<TransactionRecap[]> {
    let monthBuilder = '';
    let dateBuilder = '';
    if (month) {
        monthBuilder = `AND EXTRACT(MONTH FROM transaction_date) = ${month}`
    }
    if (date) {
        dateBuilder = `AND EXTRACT(DAY FROM transaction_date) = ${date}`
    }
    try {
        const response = await query(`SELECT TO_CHAR(transaction_date , 'YYYY-MM') AS month , COUNT(*) AS total_transaction , SUM(total_price) AS total_income  FROM transaction WHERE EXTRACT(YEAR FROM transaction_date) = ${year} ${monthBuilder} ${dateBuilder} GROUP BY month ORDER BY month`)
        return response.rows
    } catch (error) {
        console.log(error);
        return []
    }
}

export async function getTransactionRecapByMonth(year: string, month: string): Promise<TransactionRecap[]> {
    try {
        const response = await query(`SELECT 
        EXTRACT(MONTH FROM transaction_date) AS transaction_month, 
        DATE(transaction_date) AS transaction_date, 
        SUM(total_price) AS total_income 
    FROM transaction 
    WHERE EXTRACT(YEAR FROM transaction_date) = $1 
      AND EXTRACT(MONTH FROM transaction_date) = $2 
    GROUP BY transaction_month, DATE(transaction_date)
    ORDER BY transaction_date` , [year , month]);
        return response.rows
    } catch (error) {
        console.log(error)
        return []
    }
}