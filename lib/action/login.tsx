"use server"
import { compareSync } from "bcrypt";

import { getUser } from "@/helper/db/users";
import { dataLogin, formData, loginResponse, UserDb } from "@/types/login";
import { createSession } from "../auth/jwt";

export async function login(formData: dataLogin): Promise<loginResponse> {
    const { email, password } = { email: formData.email, password: formData.password }
    const user = await getUser(['email'], [`${email}`])
    if (user.length == 0) {
        return {
            status: 400,
            error: {
                email: 'Email is not registered!.',
                password: ''
            }
        }
    }
    const isPasswordCorrect = compareSync(password, user[0].password);
    if (!isPasswordCorrect) {
        return {
            status: 400,
            error: {
                email: '',
                password: 'Invalid payload'
            }
        }
    }
    try {
        const userReference = user[0] as UserDb
        await createSession({ id: parseInt(userReference.id), name: userReference.username, email: userReference.email })

    } catch (error) {
        console.log(error);
    }
    return {
        status: 200,
        error: {
            email: '',
            password: ''
        }
    }
}
