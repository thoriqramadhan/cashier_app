'use server'
import { query } from "@/lib/dbpool";
export default async function seedPostgres() {
    try {
        await query(`INSERT INTO users (username , email , password , role) VALUES ('admin' , 'admin@gmail.com' , '123321' , 'admin') ON CONFLICT DO NOTHING`);
        console.log('Success')
    } catch (error) {
        console.log('Db error :',error)
    }
}
