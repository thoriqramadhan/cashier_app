'use server'

import { createCategoryDB, getAllCategory } from "@/helper/db/category"

export async function createCategory(category: string) {
    try {
        const createResult = await createCategoryDB(category)
        console.log(createResult.status);

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