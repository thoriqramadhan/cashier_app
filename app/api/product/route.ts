import { query } from "@/lib/dbpool";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const productSchema = z.object(
    {
        product: z.string().min(3),
        stock: z.number().min(0),
        category: z.string().min(3)
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
        await query('INSERT INTO products(name , stock , category) VALUES ($1 , $2 , $3)' , [validationResult.data.product , validationResult.data.stock.toString() , validationResult.data.category])
        return NextResponse.json(payload , {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json(`Error add product : ${error}`, {status: 500})
    }
}