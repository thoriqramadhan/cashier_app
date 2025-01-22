"use server"

type formData = {
    email: string,
    password: string
}
export async function login(formData: formData) {
    console.log(`server : ${JSON.stringify(formData)}`);
    return formData
}