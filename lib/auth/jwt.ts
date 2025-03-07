'use server'
import { jwtPayload } from "@/types/login";
import { AuthInfoPayload } from "@/types/session";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.NEXT_PUBLIC_jWTSECRET;
const encodedKey = new TextEncoder().encode(secretKey);


export async function decrypt(jwtSignature: string) {
    try {
        const { payload } = await jwtVerify(jwtSignature, encodedKey)
        return payload as unknown as AuthInfoPayload
    } catch (error) {
        throw new Error('Error validating key')
    }
}
export async function createSignatureKey(payload: jwtPayload) {
    try {
        return await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1d')
            .sign(encodedKey)
    } catch (error) {
        throw new Error('Error creating jwt signature key', error)
    }
}

export async function createSession(payload: jwtPayload) {
    try {
        const expiredAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
        const jwtSignature = await createSignatureKey({ ...payload, expiredAt });
        const cookiesStore = await cookies();
        cookiesStore.set('session', jwtSignature, {
            httpOnly: true,
            secure: true,
            expires: expiredAt,
            sameSite: 'lax',
            path: '/'
        });
    } catch (error) {
        console.log(error)
        throw new Error('Error creating session')
    }
}

export async function getAuthInfo(): Promise<AuthInfoPayload | boolean> {
    const cookiesStore = await cookies()
    const jwtSignature = cookiesStore.get('session')?.value
    let authInfo;
    try {
        authInfo = (await decrypt(jwtSignature)) as AuthInfoPayload
    } catch (error) {
        authInfo = false;
    }
    return authInfo
}