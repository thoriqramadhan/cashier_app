import { query } from "@/lib/dbpool";
import { getAllProductsReturnValue } from "@/types/products";

export async function getAllProducts() : Promise<getAllProductsReturnValue[]>{
    try {
        const dbResponse = (await query('SELECT * FROM products;')).rows
        if (dbResponse.length == 0) {
            throw new Error('Empty')
        }
        return dbResponse as getAllProductsReturnValue[]
    } catch (error) {
        return []
    }
}