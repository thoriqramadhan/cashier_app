import { getAllProducts } from "@/helper/db/product";
import { query } from "@/lib/dbpool";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const productSchema = z.object(
    {
        product: z.string().min(3),
        stock: z.number().min(0),
        category: z.string().min(3),
        price: z.number().min(1000)
    }
)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { payload } = body;
        if (!payload) {
            throw new Error('Empty payload!')
        }
        const validationResult = productSchema.safeParse(payload)
        if (!validationResult.success) {
            return NextResponse.json({ error: `Data tidak valid! ${validationResult.error}` }, { status: 400 });
        }
        const productsDb = await getAllProducts()
        let isProductDuplicate;
        if (productsDb.length > 0) {
            isProductDuplicate = productsDb.find(item => item.name === validationResult.data.product.toLowerCase())
        }
        if (isProductDuplicate) {
            throw new Error('Product is duplicated!')
        }
        await query('INSERT INTO products(name , stock , category , price) VALUES ($1 , $2 , $3 , $4)' , [validationResult.data.product.toLowerCase() , validationResult.data.stock.toString() , validationResult.data.category , validationResult.data.price.toString()])
        return NextResponse.json(payload , {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json(`Error add product : ${error}`, {status: 500})
    }
}