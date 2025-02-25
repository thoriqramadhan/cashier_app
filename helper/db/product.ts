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

interface updateStocksArg {
    id: number,
    qty: number
}

// PR BELUM NGERTI BOS
export async function updateStocks(products : updateStocksArg[]) {
    try {
        // await query(`UPDATE products AS p SET stock = v.stock FROM (VALUES ${products.map(item => `(${item.id} , ${item.qty})`).join(',')}) AS v(id , stock) WHERE p.id = v.id`)

        if (products.length === 0) return;

        // Buat array untuk VALUES dengan tipe data yang jelas
        const values = products.map((_, index) => `($${index * 2 + 1}::bigint, $${index * 2 + 2}::integer)`).join(',');

        // Buat array parameter
        const params = products.flatMap(item => [item.id, item.qty]);

        // Query update stock
        await query(
            `UPDATE products AS p 
             SET stock = p.stock - v.qty 
             FROM (VALUES ${values}) AS v(id, qty)
             WHERE p.id = v.id::bigint`,
            params
        );  
    } catch (error) {
        console.log(error)
    }
}