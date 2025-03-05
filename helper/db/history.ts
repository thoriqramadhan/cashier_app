import { query } from "@/lib/dbpool";
import { TransactionData, TransactionProductData } from "@/types/transaction";

export async function getAllTransactions() : Promise<TransactionData[]>{
    try {
        const response = await query('SELECT * FROM transaction');
        return response.rows as TransactionData[]
    } catch (error) {
        console.log(error)
        return [];
    }
}

export async function getAllTransactionProducts() : Promise<TransactionProductData[]>{
    try {
        const response = await query('SELECT * FROM transaction_product;')
        return response.rows as TransactionProductData[];
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function getLastTransactionId() : Promise<TransactionData[]>{
    try {
        const response = await query('SELECT * FROM transaction ORDER BY id DESC LIMIT 1');
        return response.rows[0].id as TransactionData[]
    } catch (error) {
        console.log(error)
        return []
   } 
}