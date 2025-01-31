import { FC } from 'react';
import { _categoryClient } from './_categoryClient';
import { getAllCategory } from '@/helper/db/category';

interface PageProps {

}

const Page: FC<PageProps> = async ({ }) => {
    const allCategoryData = await getAllCategory()

    return <_categoryClient categoryDatas={allCategoryData} />
}

export default Page;