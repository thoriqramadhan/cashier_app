import { FC } from 'react';
import _productsClient from './_productsClient';
import { getAllCategory } from '@/helper/db/category';

interface PageProps {

}

const Page: FC<PageProps> = async ({ }) => {
    const categorDatas = await getAllCategory()
    return <>
        <_productsClient categoryDatas={categorDatas} />
    </>
}

export default Page;