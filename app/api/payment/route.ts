import { updateStocks } from "@/helper/db/product";
import { query } from "@/lib/dbpool";
import { CartProduct } from "@/types/products";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { selectedProduct, totalPrice , cust_name }: { selectedProduct: CartProduct[], totalPrice: string , cust_name: string } = body;
        await query('BEGIN');
        const transactionResult = await query(`INSERT INTO transaction (ordered_date , transaction_date , transaction_status , total_price , customer_name) VALUES (NOW() , NOW() , $1 , $2 , $3) RETURNING id`, ['1', totalPrice , cust_name])
        const transactionId = transactionResult.rows[0].id
        const productValues = selectedProduct.map(product => `(${transactionId} , ${product.id} , ${product.qty} , ${product.totalPrice} , '${product.name}')`).join(',')
        await query(`INSERT INTO transaction_product (transaction_id , product_id , quantity , price , name ) VALUES ${productValues}`)
        const updateStockArgs = selectedProduct.map(item => ({id: item.id , qty: item.qty}))
        await updateStocks(updateStockArgs)
        await query("COMMIT");
        return NextResponse.json(productValues , {status: 200})
    } catch (error) {
        console.log(error)
        await query("ROLLBACK");
        return NextResponse.json("Failed" , {status: 400})
    }
    
}