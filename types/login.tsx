export type validationResponse = { status: number }

export type loginResponse = {
    status: number,
    error: {
        email: string,
        password: string
    }
}

export type dataLogin = {
    email: string,
    password: string
}

export type jwtPayload = {
    id: number,
    name: string,
    email: string,
    role: string,
    expiredAt?: Date
}

export type UserDb = {
    id: string,
    username: string,
    email: string,
    password: string,
    role: string
}