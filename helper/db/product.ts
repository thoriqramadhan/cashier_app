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

export async function getProductById(id: string) : Promise<getAllProductsReturnValue | undefined>{
    try {
        const dbResponse = (await query('SELECT * FROM products WHERE id = $1' , [id])).rows
        if (dbResponse.length == 0) {
            throw new Error('Empty')
        }
        return dbResponse as unknown as getAllProductsReturnValue;
    } catch (error) {
        return undefined
    }
}

export async function deleteProductById(id: string): Promise<{ status: number }>{
    try {
        await query('DELETE FROM products WHERE id = $1', [id])
        return {status: 200}
    } catch (error) {
        return {status: 400}
    }
}