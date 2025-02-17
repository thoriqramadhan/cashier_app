'use client'
import { InputSearch } from '@/components/client/input';
import Tab, { TabItem } from '@/components/client/tab';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryResponse } from '@/helper/db/category';
import { formatToIDR } from '@/lib/utils';
import { getAllProductsReturnValue } from '@/types/products';
import { ChevronLeft } from 'lucide-react';
import { FC, useEffect, useState } from 'react';

interface _homeClientProps {
    categoryDatas: CategoryResponse[],
    productDatas: getAllProductsReturnValue[]
}

const _homeClient: FC<_homeClientProps> = ({ categoryDatas, productDatas }) => {
    const [selectedTab, setSelectedTab] = useState('all')
    const [productDataByCategory, setProductDataByCategory] = useState(productDatas)
    const [isCartOpen, setIsCartOpen] = useState(true)
    function handleChangeTab(name: string) {
        setSelectedTab(name)
    }
    useEffect(() => {
        if (selectedTab != 'all') {
            const prudctByCategory = productDatas.filter(product => product.category === selectedTab)
            setProductDataByCategory(prudctByCategory)
        } else {
            setProductDataByCategory(productDatas)
        }
    }, [selectedTab])
    return <div className='px-5 w-full my-5 relative'>
        <InputSearch className='py-2' placeHolder='Search products...' />
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
                productDataByCategory.map((product, index) => (
                    <div className="w-[250px] overflow-hidden h-[350px] bg-white rounded-lg border shadow-md flex flex-col" key={index}>
                        <div className="h-[50%] w-full bg-zinc-100 relative">
                            <div className="w-fit h-fit px-3 py-1 text-sm border capitalize bg-zinc-50 rounded-full flex justify-end items-center absolute top-3 right-3">
                                {product.category}
                            </div>
                        </div>
                        <div className="p-3 flex-1 flex flex-col">
                            <h2 className='text-xl capitalize w-full relative'>{product.name} <span className='text-xs absolute right-0 px-2 py-1 bg-green-300 rounded-full'>{product.stock}</span></h2>
                            <h2 className='text-lg text-slate-600'>{formatToIDR(Number(product.price))}</h2>
                            <Button className='w-full mt-auto' >Add</Button>
                        </div>
                    </div>
                ))
            }
        </div>
        <span className={`block p-3 rounded-full bg-zinc-100 border w-fit absolute top-1/2 cursor-pointer transition-300 z-50 ${isCartOpen ? 'right-[270px]' : 'right-3'}`} onClick={() => setIsCartOpen(prev => !prev)} >
            <ChevronLeft className={`transition-300 ${isCartOpen && 'rotate-180'}`} />
        </span>
        <ProductCartList isCartOpen={isCartOpen} />
    </div>;
}


interface ProductCartListProps {
    isCartOpen: boolean
}

const ProductCartList: FC<ProductCartListProps> = ({ isCartOpen }) => {
    return <div className={`w-[300px] border-l-[2px] h-screen fixed flex flex-col items-center bg-white rounded-tl-3xl rounded-bl-3xl overflow-hidden top-0 px-3 py-8 transition-300 z-10 ${isCartOpen ? 'right-0' : '-right-[999px]'}`}>
        <Input placeholder='Customer Name....' className='w-full shrink-0' />
        <div className="flex-1"></div>
        <div className="w-[90%] px-2 py-3 bg-zinc-200 flex flex-col rounded-lg shrink-0 gap-y-2">
            <div className="w-full flex justify-between items-end *:text-sm">
                <p >Sub Total</p>
                <p className='font-bold'>Rp.200.000</p>
            </div>
            <div className="w-full flex justify-between items-end *:text-sm">
                <p>Pajak 10%</p>
                <p className='font-bold'>Rp.20.000</p>
            </div>
            <div className="w-full flex justify-between items-end *:text-sm">
                <p>Total</p>
                <p className='font-bold'>Rp.220.000</p>
            </div>
            <div className="flex gap-x-2 mt-2">
                <Button className='flex-1'>Later</Button>
                <Button className='flex-1'>Pay</Button>
            </div>
        </div>
    </div>;
}


export default _homeClient;