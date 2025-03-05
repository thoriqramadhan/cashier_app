import { FC } from 'react';
import _productsClient from './_productsClient';
import { getAllCategory } from '@/helper/db/category';
import { getAllProducts } from '@/helper/db/product';

interface PageProps {

}

const Page: FC<PageProps> = async ({ }) => {
    const categorDatas = await getAllCategory()
    const productDatas = await getAllProducts()
    console.log(productDatas);

    return <>
        <_productsClient categoryDatas={categorDatas} productDatas={productDatas} />
    </>
}

export default Page;