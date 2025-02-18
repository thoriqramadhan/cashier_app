'use client'
import { InputSearch } from '@/components/client/input';
import Tab, { TabItem } from '@/components/client/tab';
import { ErrorText } from '@/components/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryResponse } from '@/helper/db/category';
import { formatToIDR } from '@/lib/utils';
import { CartProduct, getAllProductsReturnValue } from '@/types/products';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { createContext, Dispatch, FC, SetStateAction, useContext, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface _homeClientProps {
    categoryDatas: CategoryResponse[],
    productDatas: getAllProductsReturnValue[]
}
const SelectedProductContext = createContext<{ state: CartProduct[], setter: Dispatch<SetStateAction<CartProduct[]>> }>({
    state: [],
    setter: () => { }
})

const _homeClient: FC<_homeClientProps> = ({ categoryDatas, productDatas }) => {
    const [searchValue, setSearchValue] = useState('')
    const [searchErrorMsg, setSearchErrorMsg] = useState('')
    const [selectedTab, setSelectedTab] = useState('all')
    const [productDataByCategory, setProductDataByCategory] = useState(productDatas)

    const [selectedProducts, setSelectedProducts] = useState<CartProduct[]>([])
    const [isCartOpen, setIsCartOpen] = useState(false)

    // price
    const [prices, setPrices] = useState({ subtotal: 0, tax: 0, total: 0 })

    function handleChangeTab(name: string) {
        setSelectedTab(name)
    }
    function addProductToCart(product: CartProduct) {
        const isDuplicate = selectedProducts.find(item => item.id == product.id)
        if (isDuplicate) return;
        setSelectedProducts(prev => ([...prev, product]))
    }
    function filterProductByCategory() {
        if (selectedTab != 'all') {
            const prudctByCategory = productDatas.filter(product => product.category === selectedTab)
            setProductDataByCategory(prudctByCategory)
        } else {
            setProductDataByCategory(productDatas)
        }
    }
    const searchProducts = useDebouncedCallback(
        (value: string) => {
            setSearchValue(value)
        },
        500
    )
    // refiltering product array when tab is changed
    useEffect(() => {
        filterProductByCategory()
    }, [selectedTab])
    // calculate total price & tax when products in cart (selectedProducts) is changed.
    useEffect(() => {
        if (selectedProducts.length > 0) {
            const subtotal = selectedProducts.reduce((acc, item) => (acc + item.totalPrice), 0);
            const tax = subtotal / 10;
            const total = subtotal + tax;
            setPrices({
                subtotal,
                tax,
                total
            })
        }
    }, [selectedProducts])
    // refilter products arr when search is changed
    useEffect(() => {
        if (searchValue.length === 0) {
            setSearchErrorMsg('')
            filterProductByCategory()
            return;
        }
        const isSearchValid = productDatas.filter(product => product.name.toLowerCase().replace(/\s+/g, '').includes(searchValue.toLowerCase().replace(/\s+/g, '')))
        if (isSearchValid.length === 0) {
            setSearchErrorMsg('No products found!')
            return;
        }
        setProductDataByCategory(isSearchValid)
        if (searchErrorMsg.length > 0) {
            setSearchErrorMsg('')
        }

    }, [searchValue])
    return <div className='px-5 w-full my-5 relative'>
        <InputSearch className='py-2' placeHolder='Search products...' onChange={(e) => searchProducts(e.target.value)} />
        {searchErrorMsg.length > 0 && <ErrorText className='ml-3 mt-[3px]'>{searchErrorMsg}</ErrorText>}
        <Tab>
            <TabItem selectedTab={selectedTab} name='all' onClick={() => handleChangeTab('all')}>All</TabItem>
            {
                categoryDatas?.map((item, index) => (
                    <TabItem selectedTab={selectedTab} name={item.name} key={index} onClick={() => handleChangeTab(item.name)} />
                ))
            }
        </Tab>
        <div className="w-full my-5 flex gap-5 flex-wrap">
            {
                productDataByCategory.map((product, index) => (
                    <div className="w-[250px] overflow-hidden h-[350px] bg-white rounded-lg border shadow-md flex flex-col shrink-0" key={index}>
                        <div className="h-[50%] w-full bg-zinc-100 relative">
                            <div className="w-fit h-fit px-3 py-1 text-sm border capitalize bg-zinc-50 rounded-full flex justify-end items-center absolute top-3 right-3">
                                {product.category}
                            </div>
                        </div>
                        <div className="p-3 flex-1 flex flex-col">
                            <h2 className='text-xl capitalize w-full relative'>{product.name} <span className='text-xs absolute right-0 px-2 py-1 bg-green-300 rounded-full'>{product.stock}</span></h2>
                            <h2 className='text-lg text-slate-600'>{formatToIDR(Number(product.price))}</h2>
                            <Button className='w-full mt-auto' onClick={() => addProductToCart({ id: product.id, name: product.name, price: Number(product.price), qty: 1, totalPrice: Number(product.price) })}>Add</Button>
                        </div>
                    </div>
                ))
            }
        </div>

        {/* cart */}
        <div className={`h-screen w-px fixed top-0 right-3 z-50`}>
            <span className={`block p-3 rounded-full bg-zinc-100 border w-fit absolute top-1/2 cursor-pointer transition-300 z-50 ${isCartOpen ? 'right-[270px]' : 'right-3'}`} onClick={() => setIsCartOpen(prev => !prev)} >
                <ChevronLeft className={`transition-300 ${isCartOpen && 'rotate-180'}`} />
            </span>
        </div>
        <SelectedProductContext.Provider value={{ state: selectedProducts, setter: setSelectedProducts }}>
            <ProductCartList isCartOpen={isCartOpen} selectedProduct={{ state: selectedProducts, setter: setSelectedProducts }} prices={prices} />
        </SelectedProductContext.Provider >
    </div >;
}


interface ProductCartListProps {
    isCartOpen: boolean,
    selectedProduct: { state: CartProduct[], setter: Dispatch<SetStateAction<CartProduct[]>> },
    prices: { subtotal: number, tax: number, total: number }
}

const ProductCartList: FC<ProductCartListProps> = ({ isCartOpen, selectedProduct, prices }) => {
    return <div className={`w-[300px] border-l-[2px] h-screen fixed flex flex-col items-center bg-white rounded-tl-3xl rounded-bl-3xl overflow-hidden top-0 px-3 py-8 transition-300 z-10 gap-y-3 ${isCartOpen ? 'right-0' : '-right-[999px]'}`}>
        <Input placeholder='Customer Name....' className='w-full shrink-0' />
        <div className="flex-1 w-full overflow-y-auto scrollbar-thin space-y-2">
            {
                selectedProduct.state.map((item, index) => (
                    <CartCard key={index} productData={item} />
                ))
            }
        </div>
        <div className="w-full px-2 py-3 bg-zinc-200 flex flex-col rounded-lg shrink-0 gap-y-2">
            <div className="w-full flex justify-between items-end *:text-sm">
                <p >Sub Total</p>
                <p className='font-bold'>{formatToIDR(prices.subtotal)}</p>
            </div>
            <div className="w-full flex justify-between items-end *:text-sm">
                <p>Pajak 10%</p>
                <p className='font-bold'>{formatToIDR(prices.tax)}</p>
            </div>
            <div className="w-full flex justify-between items-end *:text-sm">
                <p>Total</p>
                <p className='font-bold'>{formatToIDR(prices.total)}</p>
            </div>
            <div className="flex gap-x-2 mt-2">
                <Button className='flex-1'>Later</Button>
                <Button className='flex-1'>Pay</Button>
            </div>
        </div>
    </div>;
}


interface CartCardProps {
    productData: CartProduct
}

const CartCard: FC<CartCardProps> = ({ productData }) => {
    const cartDatInit = {
        totalPrice: productData.totalPrice,
        price: productData.price,
        qty: 1
    }
    const [cartData, setCartData] = useState(cartDatInit)
    const { state, setter } = useContext(SelectedProductContext)
    function handleChangeQty(option: 'plus' | 'minus',) {
        if (cartData.qty == 1 && option == 'minus') {
            return;
        }
        setCartData(prev => ({
            ...prev,
            totalPrice: cartDatInit.price * (option == 'plus' ? prev.qty + 1 : prev.qty - 1),
            qty: option == 'plus' ? prev.qty + 1 : prev.qty - 1
        }))
    }
    useEffect(() => {
        const newSelectedArr = state.map(item => {
            if (item.id == productData.id) {
                const newProductData = productData;
                newProductData.qty = cartData.qty
                newProductData.totalPrice = cartData.totalPrice
                return newProductData
            }
            return item;
        })
        setter(newSelectedArr)
    }, [cartData])
    return <div className="w-full h-[100px] border bg-white rounded-lg p-2 flex gap-x-3 relative" >
        <div className="w-[80px] h-full rounded-md bg-zinc-100 border shrink-0"></div>
        <div className="flex-1">
            <h3 className='font-medium text-lg'>{productData.name}</h3>
            <p className='text-sm'>{formatToIDR(cartData.totalPrice)}</p>
        </div>S
        <div className="flex items-center justify-center gap-x-2 self-end h-fit w-fit absolute bottom-2 right-2">
            <Button className='px-2 py-1 h-fit' onClick={() => handleChangeQty('plus')}>+</Button>
            <input type="text" name="quantity" id="quantity" className='min-w-[20px] max-w-[24px] text-center focus:ring-0 focus:outline-none ' value={cartData.qty} onChange={(e) => setCartData(prev => ({ ...prev, qty: Number(e.target.value), totalPrice: prev.price * Number(e.target.value) }))} />
            <Button className='px-2 py-1 h-fit' onClick={() => handleChangeQty('minus')}>-</Button>
        </div>
        <Trash2 size={15} className='absolute top-2 right-2' />
    </div>
}

export default _homeClient;