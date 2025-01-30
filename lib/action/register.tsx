"use server"
import { hash } from "bcrypt";

import { createUser, getUser } from "@/helper/db/users";
import { dataRegister, registerResponse } from "@/types/register";

export async function register(formData: dataRegister): Promise<registerResponse> {
    const { name, email, password } = { name: formData.name, email: formData.email, password: formData.password }
    const responseInit = {
        status: 200,
        error: {
            email: '',
            password: '',
            name: ''
        }
    }
    const user = await getUser(['email'], [`${email}`])
    if (user.length > 0) {
        responseInit.status = 400;
        responseInit.error.email = 'Email is duplicated!.'
        return responseInit
    }
    const hashedPassword = await hash(password, 10)
    try {
        await createUser({ name, email, password: hashedPassword, role: 'cashier' })
    } catch (error) {
        responseInit.error.password = 'error creating users'
        return responseInit;
    }
    responseInit.success = 'Success adding employee'
    return responseInit
}
