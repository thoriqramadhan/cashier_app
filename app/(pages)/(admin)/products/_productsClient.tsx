'use client'
import { DropdownContainer, DropdownItem } from '@/components/client/dropdown';
import { InputSearch } from '@/components/client/input';
import Tab, { TabItem } from '@/components/client/tab';
import Title from '@/components/client/title';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryResponse } from '@/helper/db/category';
import { createContext, Dispatch, FC, SetStateAction, useContext, useState } from 'react';

interface _productsClientProps {
    categoryDatas: CategoryResponse[]
}
interface ProductContextType {
    pageStatus: pageStatusProps,
    setPageStatus: Dispatch<SetStateAction<pageStatusProps>>,
    categoryDatas: CategoryResponse[]
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

const _productsClient: FC<_productsClientProps> = ({ categoryDatas }) => {
    const [pageStatus, setPageStatus] = useState<pageStatusProps>('add')
    function renderPageHandler() {
        if (pageStatus == 'list') {
            return <ListPage />
        } else {
            return <AddPage />
        }
    }
    return <div className="px-5 w-full my-5">
        <ProductContext.Provider value={{ pageStatus, setPageStatus, categoryDatas }}>
            {renderPageHandler()}
        </ProductContext.Provider>
    </div>
}


interface ListPageProps {
}

const ListPage: FC<ListPageProps> = ({ }) => {
    const { pageStatus, setPageStatus, categoryDatas } = useProductContext();
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
        <span className='w-full h-[2px] bg-zinc-50 block rounded-full'></span>
        <div className="w-full my-5">
            <div className="w-[250px] overflow-hidden h-[350px] bg-white rounded-lg border shadow-md flex flex-col">
                <div className="h-[50%] w-full bg-zinc-50 relative">
                    <div className="w-fit h-fit px-3 py-1 text-sm border bg-zinc-50 rounded-full flex justify-end items-center absolute top-3 right-3">
                        Drink
                    </div>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                    <h2 className='text-xl'>Cofee</h2>
                    <h2 className='text-lg text-slate-600'>Rp 10.000</h2>
                    <Button className='w-full mt-auto'>Edit</Button>
                </div>
            </div>
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

    return <>
        <div className="w-full justify-end flex h-[50px]">
            <Button onClick={() => setPageStatus('list')}>Back</Button>
        </div>
        <Title title='Products' desc='Add you products.' className='mb-5' />
        <div className="w-full flex gap-x-5">
            <div className="w-[150px] h-[150px] bg-red-100 rounded-md"></div>
            <div className=" flex-1 grid grid-cols-2 grid-rows-2 gap-x-3">
                <Input className='col-span-2' placeholder='Product name....' name='product_name' />
                <Input type='number' placeholder='Stock' min='0' step='1' name='product_stock' />
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
        </div>
    </>
}



export default _productsClient;