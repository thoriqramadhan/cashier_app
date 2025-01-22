import { Pool } from "pg";

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : undefined,
    database: process.env.POSTGRES_DBNAME,
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD
})

type queryParameterType = string[] 
export const query = (query: string, parameter?: queryParameterType) => {
    return pool.query(query , parameter)
}