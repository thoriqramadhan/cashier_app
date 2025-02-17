import { getAllCategory } from '@/helper/db/category';
import { getAllProducts } from '@/helper/db/product';
import _homeClient from './_homeClient';
import { FC } from 'react';

interface PageProps {

}

const Page: FC<PageProps> = async ({ }) => {
    const categorDatas = await getAllCategory()
    const productDatas = await getAllProducts()
    return <_homeClient categoryDatas={categorDatas} productDatas={productDatas} />
}

export default Page;