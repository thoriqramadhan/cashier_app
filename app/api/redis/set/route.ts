import { redisClient } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const {option}:{option: 'sismember'} = body
        if (option == 'sismember') {
            const {key} = body
            const {value} = body
            const response = await redisClient.sIsMember(key, value)
            return NextResponse.json({isBlacklisted:response} , {status:200})
        }
        
    } catch (error) {
        return NextResponse.json('Failed to get data' , {status:400})
        
    }
}