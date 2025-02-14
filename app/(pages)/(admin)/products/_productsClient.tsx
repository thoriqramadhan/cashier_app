'use client'
import { DropdownContainer, DropdownItem } from '@/components/client/dropdown';
import { InputSearch } from '@/components/client/input';
import Tab, { TabItem } from '@/components/client/tab';
import Title from '@/components/client/title';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryResponse } from '@/helper/db/category';
import { getAllProductsReturnValue } from '@/types/products';
import { createContext, Dispatch, FC, FormEvent, SetStateAction, useContext, useState } from 'react';
import { z } from 'zod';

interface _productsClientProps {
    categoryDatas: CategoryResponse[],
    productDatas: getAllProductsReturnValue[]
}
interface ProductContextType {
    pageStatus: pageStatusProps,
    setPageStatus: Dispatch<SetStateAction<pageStatusProps>>,
    categoryDatas: CategoryResponse[],
    productDatas: getAllProductsReturnValue[]
}
const ProductContext = createContext<ProductContextType | undefined>(undefined)

type pageStatusProps = 'list' | 'add'
const useProductContext = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useProductContext must be used within a ProductContext.Provider");
    }
    return context;
};

const _productsClient: FC<_productsClientProps> = ({ categoryDatas, productDatas }) => {
    const [pageStatus, setPageStatus] = useState<pageStatusProps>('list')
    function renderPageHandler() {
        if (pageStatus == 'list') {
            return <ListPage />
        } else {
            return <AddPage />
        }
    }
    return <div className="px-5 w-full my-5">
        <ProductContext.Provider value={{ pageStatus, setPageStatus, categoryDatas, productDatas }}>
            {renderPageHandler()}
        </ProductContext.Provider>
    </div>
}


interface ListPageProps {
}

const ListPage: FC<ListPageProps> = ({ }) => {
    const { pageStatus, setPageStatus, categoryDatas, productDatas } = useProductContext();
    const [selectedTab, setSelectedTab] = useState('all')
    function handleChangeTab(name: string) {
        setSelectedTab(name)
    }
    return <>
        <div className='w-full h-[50px] flex justify-between items-center'>
            <InputSearch />
            <Button onClick={() => setPageStatus('add')}>Add Menu</Button>
        </div>
        <Tab>
            <TabItem selectedTab={selectedTab} name='all' onClick={() => handleChangeTab('all')}>All</TabItem>
            {
                categoryDatas?.map((item, index) => (
                    <TabItem selectedTab={selectedTab} name={item.name} key={index} onClick={() => handleChangeTab(item.name)} />
                ))
            }
        </Tab>
        <div className="w-full my-5 flex gap-5">
            {
                productDatas.map((product, index) => (
                    <div className="w-[250px] overflow-hidden h-[350px] bg-white rounded-lg border shadow-md flex flex-col" key={index}>
                        <div className="h-[50%] w-full bg-zinc-100 relative">
                            <div className="w-fit h-fit px-3 py-1 text-sm border capitalize bg-zinc-50 rounded-full flex justify-end items-center absolute top-3 right-3">
                                {product.category}
                            </div>
                        </div>
                        <div className="p-3 flex-1 flex flex-col">
                            <h2 className='text-xl'>{product.name}</h2>
                            <h2 className='text-lg text-slate-600'>Rp 10.000</h2>
                            <Button className='w-full mt-auto'>Edit</Button>
                        </div>
                    </div>
                )) && <p>NODATASS</p>
            }
        </div>
    </>
}


interface AddPageProps {

}

const AddPage: FC<AddPageProps> = ({ }) => {
    const { pageStatus, setPageStatus, categoryDatas } = useProductContext();
    const [selectedCategory, setSelectedCategory] = useState('Category')
    function changeSelectedCategory(value: string) {
        setSelectedCategory(value)
    }
    function checkIsDataValid(productName: string, stock: number, category: string, price: number) {
        const errors = { product: '', stock: '', category: '', price: '' }
        let isSuccess = true
        const isProductValid = z.string().min(3).safeParse(productName)
        const isStockValid = z.number().min(0).safeParse(stock)
        const isPriceValid = z.number().min(0).safeParse(price)
        const isCategoryValid = z.string().min(3).safeParse(category)
        if (!isProductValid.success) {
            errors.product = isProductValid.error.message
            isSuccess = false
        }
        if (!isStockValid.success) {
            errors.stock = isStockValid.error.message
            isSuccess = false;
        }
        if (!isCategoryValid.success) {
            errors.category = isCategoryValid.error.message
            isSuccess = false
        }
        if (!isPriceValid.success) {
            errors.price = isPriceValid.error.message
            isSuccess = false
        }
        if (isSuccess) {
            return { status: 200, errors }
        } else {
            return { status: 400, errors }
        }
    }
    async function handleCreateProduct(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = event.currentTarget
        const formData = new FormData(form)
        const { productName, stock, category, price } = { productName: formData.get('product_name'), stock: Number(formData.get('product_stock')), category: selectedCategory, price: Number(formData.get('product_price')) }
        const validationResult = checkIsDataValid(productName, stock, category, price)
        if (validationResult.status === 400) {
            console.log(validationResult.errors);
            return;
        }
        try {
            const productData = { product: productName, stock, category, price }
            const response = await fetch('/api/product', {
                method: 'POST',
                body: JSON.stringify({ payload: productData })
            })
            const responseData = await response.json()
            console.log(responseData);


        } catch (error) {
            console.log(error)
        }
    }
    return <>
        <div className="w-full justify-end flex h-[50px]">
            <Button onClick={() => setPageStatus('list')}>Back</Button>
        </div>
        <Title title='Products' desc='Add you products.' className='mb-5' />
        <div className="w-full flex gap-x-5">
            <div className="w-[150px] h-[150px] bg-red-100 rounded-md shrink-0"></div>
            <form onSubmit={handleCreateProduct} className='w-full'>
                <div className=" flex-1 grid grid-cols-2 grid-rows-2 gap-x-3 h-full">
                    <Input placeholder='Product name....' name='product_name' required />
                    <Input type='number' placeholder='Stock' min='0' step='1' name='product_stock' required />
                    <Input type='number' placeholder='Price' min='1000' step='1000' name='product_price' required />
                    <DropdownContainer itemStyle='full' appereance={<div className="w-full h-full flex items-center px-5">{selectedCategory}</div>} className='border h-[36px] rounded-[6px] shadow-sm'>
                        {
                            categoryDatas.map((category, index) => (
                                <DropdownItem key={index} onClickCallback={() => changeSelectedCategory(category.name)} className='capitalize'>
                                    {category.name}
                                </DropdownItem>
                            ))
                        }
                    </DropdownContainer>
                    <Button className='w-full col-span-2'>Add</Button>
                </div>
            </form>
        </div>
    </>
}



export default _productsClient;