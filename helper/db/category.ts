import { query } from "@/lib/dbpool"

export async function getAllCategory(){
    try {
        const dbResult = (await query('SELECT * FROM category;')).rows
        return dbResult as CategoryResponse[];
    } catch (error) {
        throw new Error('Failed to get all category : ',error)
    }
}

export interface CategoryResponse  {
    name: string
}
export async function createCategoryDB(value: string): Promise<{status: number}> {
    try {
        const categorys = await getAllCategory();
        const isCategoryDuplicate = categorys.map(category => category.name.toLowerCase()).includes(value.toLowerCase())
        if (isCategoryDuplicate) {
            return {status: 400}
        }
        await query('INSERT INTO category (name) VALUES ($1)', [value])
        return {status:200}
    } catch (error) {
        console.log('Error creating category :')
        throw new Error('Error creating category :' , error)
    }
}

export async function deleteCategoryDB(category: string) : Promise<{status: number}>{
    try {
        const categorys = await getAllCategory()
        const isCatogoryAvailable = categorys.filter(item => item.name === category);
        if (isCatogoryAvailable.length == 0) {
            return {status: 400}
        }
        await query("DELETE FROM category WHERE name = $1", [category])
        return {status: 200}
    } catch (error) {
        console.log('Error creating category :')
        throw new Error('Error creating category :' , error)
    }
}