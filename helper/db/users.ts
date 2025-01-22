import { query } from "@/lib/dbpool";

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