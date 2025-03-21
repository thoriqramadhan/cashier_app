'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { redisClient } from "../redis"

export async function logout() {
    const cookieStore = await cookies()
    const sessionKey = await cookieStore.get('session').value
    try {
        await redisClient.sAdd('blacklisted_session' , sessionKey)
        // const sessionId = await redisClient.incr('session:counter')
        // await redisClient.json.set('session:1' , `session.${sessionId}` , sessionKey)
    } catch (error) {
        console.log(error)
    } finally {
        cookieStore.delete('session')
        redirect('/login')
    }
}