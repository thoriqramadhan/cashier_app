import { query } from "@/lib/dbpool";
import { UserDb } from "@/types/login";

type userIdentifier = 'id' | 'email';
function userIdentifierBuilder(identifier: userIdentifier) {
    if (identifier == 'id') {
        return 'id = '
    } else if (identifier = 'email') {
        return 'email = '
    }
}
function whereClauseBuilder(identifier: userIdentifier[], value: string[]) {
    let result = '';
    if (identifier.length > 1 && value.length > 1) {
        for (let index = 1; index <= identifier.length; index++) {
            result += `${userIdentifierBuilder(identifier[index - 1])}'${value[index - 1]}'`
            if (index < identifier.length ) {
                result += ' AND '
            }
        }
    } else {
        result =  `${userIdentifierBuilder(identifier[0])}'${value[0]}'`
    }
    return result;
}

export async function getUser(identifier: userIdentifier[], value: string[]) {
    const builderResult = whereClauseBuilder(identifier, value)
    try {
        return (await query(`SELECT * FROM users WHERE ${builderResult}`)).rows
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export async function createUser({name , email , password , role}: {name: string , email : string, password : string, role: string} ) {
    try {
        await query('INSERT INTO users(username , email , password , role) VALUES ( $1 , $2 , $3 , $4)' , [name, email,password,role])
    } catch (error) {
        
    }
}

export async function getAllUsers() : Promise<UserDb[]>{
    try {
        const response = await query('SELECT * FROM users');
        return response.rows;
    } catch (error) {
        console.log(error)
        return []
    }
}