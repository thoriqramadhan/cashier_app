'use server'
import { query } from "@/lib/dbpool";
import {hash} from "bcrypt";
export default async function seedPostgres() {
    try {
        const hashedPassword = await hash('123321', 10)
        console.log(hashedPassword)
        await query(`INSERT INTO users (username , email , password , role) VALUES ('admin' , 'admin@gmail.com' , '${hashedPassword}' , 'admin') ON CONFLICT DO NOTHING`);
    } catch (error) {
        console.log('Db error :',error)
    }
}
