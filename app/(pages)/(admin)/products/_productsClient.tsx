'use client'
import { DropdownContainer, DropdownItem } from '@/components/client/dropdown';
import { InputSearch } from '@/components/client/input';
import Modal from '@/components/client/modal';
import Tab, { TabItem } from '@/components/client/tab';
import Title from '@/components/client/title';
import { useModal } from '@/components/context/modalContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryResponse } from '@/helper/db/category';
import { formatToIDR } from '@/lib/utils';
import { getAllProductsReturnValue } from '@/types/products';
import { Trash2 } from 'lucide-react';
import { createContext, Dispatch, FC, FormEvent, SetStateAction, useContext, useEffect, useState } from 'react';
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
const ListPage: FC<ListPageProps> = ({ }) => {
    const editDataInit = { name: '', stock: 0, price: 0, category: 'Category', id: 0 }
    const { pageStatus, setPageStatus, categoryDatas, productDatas } = useProductContext();

    const [selectedTab, setSelectedTab] = useState('all')
    const { modalSetter, modalState } = useModal()
    const [modalType, setModalType] = useState<'edit' | 'delete'>('edit')

    const [productDataByCategory, setProductDataByCategory] = useState(productDatas)
    const [editData, setEditData] = useState(editDataInit)

    // functions
    function changeSelectedCategory(value: string) {
        setEditData(prev => ({ ...prev, category: value }))
    }
    async function handleEdit(option: 'open' | 'edit', value: getAllProductsReturnValue, event?: FormEvent) {
        if (option == 'open') {
            modalSetter('state', !modalState.isOpen)
            setEditData({ name: value.name, price: Number(value.price), category: value.category, stock: Number(value.stock), id: Number(value.id) })

        } else if (option == 'edit') {
            event?.preventDefault()
            const validationResult = checkIsDataValid(editData.name, editData.stock, editData.category, editData.price)
            if (validationResult.status === 400) {
                console.log(editData);
                console.log(validationResult.errors);
                return;
            }
            try {
                const response = await fetch('/api/product', {
                    method: 'PATCH',
                    body: JSON.stringify({ payload: editData })
                })
                if (response.ok) {
                    const newProductData = productDataByCategory.map(product => {
                        if ((Number(product!.id)) == editData.id) {
                            return {
                                name: editData.name,
                                stock: editData.stock.toString(),
                                price: editData.price.toString(),
                                category: editData.category,
                                id: editData.id.toString()
                            }
                        }
                        return product
                    })
                    setProductDataByCategory(newProductData)
                    setEditData(editDataInit)
                    modalSetter('state', !modalState.isOpen)
                } else {
                    throw new Error(response.statusText)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
    async function handleDelete(option: 'open' | 'delete', name: string, id: number) {
        if (option == 'open') {
            setModalType('delete')
            setEditData(prev => ({ ...prev, name, id }))
            modalSetter('state', !modalState.isOpen)

        } else {
            try {
                const deleteResponse = await fetch('/api/product', {
                    method: "DELETE",
                    body: JSON.stringify({ id })
                })
                if (!deleteResponse.ok) {
                    throw new Error('Failed to delete ' + id)
                }
                setEditData(editDataInit)
                modalSetter('state', !modalState.isOpen)
                const newProductData = productDatas.filter(product => product.id != id.toString())
                setProductDataByCategory(newProductData)

            } catch (error) {
                console.log(error);
            }
        }
    }
    function handleChangeInput(newValue: string, propertyName: string) {
        setEditData(prev => (
            {
                ...prev,
                [propertyName]: propertyName == 'stock' || propertyName == 'price' ? Number(newValue) : newValue
            }
        ))
    }
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
                productDataByCategory.map((product, index) => (
                    <div className="w-[250px] overflow-hidden h-[350px] bg-white rounded-lg border shadow-md flex flex-col" key={index}>
                        <div className="h-[50%] w-full bg-zinc-100 relative">
                            <div className="w-fit h-fit px-3 py-1 text-sm border capitalize bg-zinc-50 rounded-full flex justify-end items-center absolute top-3 right-3">
                                {product.category}
                            </div>
                            <Trash2 size={20} className='absolute top-5 left-3 text-red-500 cursor-pointer' onClick={() => handleDelete('open', product.name, product.id)} />
                        </div>
                        <div className="p-3 flex-1 flex flex-col">
                            <h2 className='text-xl capitalize w-full relative'>{product.name} <span className='text-xs absolute right-0 px-2 py-1 bg-green-300 rounded-full'>{product.stock}</span></h2>
                            <h2 className='text-lg text-slate-600'>{formatToIDR(Number(product.price))}</h2>
                            <Button className='w-full mt-auto' onClick={() => handleEdit('open', product)}>Edit</Button>
                        </div>
                    </div>
                ))
            }
        </div>
        <Modal >
            {
                modalType == 'edit' ?
                    <form className='w-full grid grid-cols-2 gap-3 px-5' onSubmit={e => handleEdit('edit', editData, e)}>
                        <h1 className='col-span-2'>Edit Product</h1>
                        <Input placeholder='Product name....' name='product_name' required value={editData.name} onChange={e => handleChangeInput(e.target.value, 'name')} />
                        <Input type='number' placeholder='Stock' min='0' step='1' name='product_stock' required value={editData.stock} onChange={e => handleChangeInput(e.target.value, 'stock')} />
                        <Input type='number' placeholder='Price' min='1000' step='1000' name='product_price' required value={editData.price} onChange={e => handleChangeInput(e.target.value, 'price')} />
                        <DropdownContainer itemStyle='full' appereance={<div className="w-full h-full flex items-center px-5">{editData.category}</div>} className='border h-[36px] rounded-[6px] shadow-sm'>
                            {
                                categoryDatas.map((category, index) => (
                                    <DropdownItem key={index} onClickCallback={() => changeSelectedCategory(category.name)} className='capitalize'>
                                        {category.name}
                                    </DropdownItem>
                                ))
                            }
                        </DropdownContainer>
                        <Button className='col-span-2' type='submit'>Edit</Button>
                    </form> :
                    <div className="w-full grid grid-cols-2 gap-3 px-5">
                        <h1 className='col-span-2'>Delete <b className='capitalize'>{editData.name}</b> Product?</h1>
                        <Button className='bg-red-700' onClick={() => handleDelete('delete', '', editData.id)}>Yes</Button>
                        <Button>No</Button>
                    </div>
            }
        </Modal>
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