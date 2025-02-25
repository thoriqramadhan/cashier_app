export type dataRegister = {
    name: string,
    email: string,
    password: string
}

export type registerResponse = {
    status: number,
    error: {
        name: string,
        email: string,
        password: string
    }
}

export type changeEmployeeDataArgs = { name: string } | { email: string } | { password: string }