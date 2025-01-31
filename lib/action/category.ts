'use server'

import { createCategoryDB, deleteCategoryDB, getAllCategory } from "@/helper/db/category"

export async function createCategory(category: string) {
    try {
        const createResult = await createCategoryDB(category.toLowerCase())

        if (createResult.status == 400) {
            return {
                status: 400,
                error: {
                    category: 'Category is duplicate!',
                }
            }
        }
        return {
            status: 200
        }

    } catch (error) {
        return 'gagal'
    }
}

export async function deleteCategory(category: string) {
    try {
        const deleteResponse = await deleteCategoryDB(category);
        if (deleteResponse.status == 400) {
            return {
                status: 400
            }
        } else {
            return {
                status: 200
            }
        }
    } catch (error) {
        console.log(error);
        
        return {
            status: 400
        }
    }
}