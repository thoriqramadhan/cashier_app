'use client'
import Modal from '@/components/client/modal';
import { useModal } from '@/components/context/modalContext';
import { formatToIDR } from '@/lib/utils';
import { FC, useEffect, useState } from 'react';
import Title from '@/components/client/title';
import { TransactionProductData } from '@/types/transaction';
import { DropdownItem, DropdownSettings } from '@/components/client/dropdown';
import { Check, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';

interface _ordersClientProps {
}

const _ordersClient: FC<_ordersClientProps> = ({ }) => {
    const { modalSetter, modalState } = useModal()
    const [modalType, setModalType] = useState<'normal' | 'edit'>('normal')
    const transactionDetailDataInit: { customer_name: string, products_detail: TransactionProductData[], transaction_id: string } = {
        customer_name: '',
        transaction_id: '0',
        products_detail: []
    }
    const [transactionDatas, setTransactionDatas] = useState(JSON.parse(localStorage.getItem('transaction')) ?? [])
    const [transactionDetailData, setTransactionDetailData] = useState(transactionDetailDataInit)
    const [taxState, setTaxState] = useState(0)
    const [loading, setLoading] = useState(true)

    const date = new Date();
    function openTransactionDetail(id: string) {
        const transactionProductDatas = JSON.parse(localStorage.getItem('transaction_detail')) ?? []
        const customer_name = transactionDatas.filter(item => item.id === id)[0].customer_name
        const products_detail = transactionProductDatas.filter(item => item.transaction_id === id)

        setTransactionDetailData({ customer_name, products_detail, transaction_id: id })
        modalSetter('state', !modalState.isOpen)
    }
    async function addToHistory() {
        const selectedProduct = transactionDetailData.products_detail.map(item => ({ id: item.product_id, name: item.name, qty: item.quantity, price: item.price, totalPrice: Number(item.quantity) * Number(item.price) }))
        const totalPrice = transactionDatas.filter(item => item.id == transactionDetailData.transaction_id)[0].total_price
        const response = await fetch('/api/payment', {
            method: 'POST',
            body: JSON.stringify({ selectedProduct, totalPrice, cust_name: transactionDetailData.customer_name })
        })
        if (response.ok) {
            const newTransactionDatas = transactionDatas.filter(item => item.id != transactionDetailData.transaction_id)
            setTransactionDatas(newTransactionDatas)
            localStorage.setItem('transaction', JSON.stringify(newTransactionDatas))

            const productDetail = JSON.parse(localStorage.getItem('transaction_detail'))
            const newProductDetail = productDetail.filter(item => item.transaction_id != transactionDetailData.transaction_id)
            localStorage.setItem('transaction_detail', JSON.stringify(newProductDetail))
            setTransactionDetailData(transactionDetailDataInit)
            modalSetter('state', !modalState)
        }


    }
    function deleteOrder() {
        const transactionStorage = JSON.parse(localStorage.getItem('transaction'))
        const transactionDetailStorage = JSON.parse(localStorage.getItem('transaction_detail'))
        const newTransaction = transactionStorage.filter(item => item.id != transactionDetailData.transaction_id)
        const newTransactionDetail = transactionDetailStorage.filter(item => item.transaction_id != transactionDetailData.transaction_id)
        localStorage.setItem('transaction', JSON.stringify(newTransaction))
        localStorage.setItem('transaction_detail', JSON.stringify(newTransactionDetail))
        setTransactionDatas(newTransaction)
        modalSetter('state', !modalState)
    }
    function handleEdit(option: 'open' | 'edit') {
        if (option === 'open') {
            setModalType('edit')
        }
        if (option === 'edit') {
            // filter transactionDetail without selected transactionDetail
            const filteredProductStorage = (JSON.parse(localStorage.getItem('transaction_detail')) as TransactionProductData[]).filter(product => product.transaction_id != transactionDetailData.transaction_id)
            // add new transactionDetail
            filteredProductStorage.push(...transactionDetailData.products_detail)
            // calculate total price & tax
            const totalPrice = (transactionDetailData.products_detail.reduce((prev, current) => (Number(current.price) * Number(current.quantity) + prev), 0));
            const totalPriceWithTax = totalPrice * (taxState / 100) + totalPrice
            // update transaction data reference
            const newTransctionStorage = transactionDatas.map(transaction => {
                if (transaction.id === transactionDetailData.transaction_id) {
                    return { ...transaction, total_price: totalPriceWithTax }
                }
                return transaction
            })

            // update transaction & transaction_detail on localStorage & transaction state
            localStorage.setItem('transaction_detail', JSON.stringify(filteredProductStorage))
            localStorage.setItem('transaction', JSON.stringify(newTransctionStorage))
            setTransactionDatas(newTransctionStorage)
            modalSetter('state', !modalState)
            setTransactionDetailData(transactionDetailDataInit)
        }
    }
    function handleChangeProductQty(transactionId: string, productId: string, option: 'plus' | 'minus' | 'all', quantity?: number) {
        let newTransactionDetail = transactionDetailData.products_detail;
        if (option == 'plus') {
            newTransactionDetail = transactionDetailData.products_detail.map(product => {
                if (product.product_id == productId && product.transaction_id == transactionId) {
                    return {
                        ...product,
                        quantity: (Number(product.quantity) + 1)
                    }
                }
                return product
            })
        } else if (option == 'minus') {
            newTransactionDetail = transactionDetailData.products_detail.map(product => {
                if (product.product_id == productId && product.transaction_id == transactionId) {
                    if (product.quantity == '1') return product;
                    return {
                        ...product,
                        quantity: (Number(product.quantity) - 1)
                    }
                }
                return product
            })
        } else {
            newTransactionDetail = transactionDetailData.products_detail.map(product => {
                if (product.product_id == productId && product.transaction_id == transactionId) {
                    return {
                        ...product,
                        quantity: Number(quantity)
                    }
                }
                return product
            })
        }
        setTransactionDetailData(prev => ({ ...prev, products_detail: newTransactionDetail }))
    }
    useEffect(() => {
        if (modalState.isOpen == false) { setModalType('normal') }
    }, [modalState.isOpen])
    useEffect(() => {
        const fetchTax = async () => {
            try {
                const response = await fetch('/api/tax')
                if (!response.ok) throw new Error(response.statusText)
                const responseData = await response.json()
                setTaxState(responseData.data[0].value)

            } catch (error) {
                console.log(error);

            } finally {
                setLoading(false)
            }
        }
        fetchTax()
    }, [])
    if (loading) return <Loading size={50} />
    return <>
        <table className='w-full mt-10 max-h-[300px] table-fixed'>
            <thead>
                <tr className='h-fit bg-darkerMain text-white'>
                    <th>Customer</th>
                    <th>Order Date</th>
                    <th>Transaction Date</th>
                    <th>Status</th>
                    <th>Total Price</th>
                </tr>
            </thead>
            <tbody className='h-fit'>
                {
                    transactionDatas!.map((item, index) => (
                        <tr key={index} className='text-center transition-300 hover:bg-zinc-100 cursor-pointer' onClick={() => openTransactionDetail(item.id)}>
                            <td>{item.customer_name}</td>
                            <td>{date.toLocaleDateString(item.ordered_date)}</td>
                            <td>{date.toLocaleDateString(item.transaction_date)}</td>
                            <td>{item.transaction_status ? 'Success' : 'Delayed'}</td>
                            <td>{formatToIDR(Number(item.total_price))}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
        <Modal className='space-y-3 relative'>
            <DropdownSettings className='absolute top-4 right-4'>
                <DropdownItem icon={<Trash2 />} onClickCallback={() => deleteOrder()}>Delete</DropdownItem>
                <DropdownItem icon={<Pencil />} onClickCallback={() => handleEdit('open')}>Edit</DropdownItem>
                <DropdownItem icon={<Check />} onClickCallback={() => addToHistory()}>Done</DropdownItem>
            </DropdownSettings>
            <Title title='Transaction Detail' className='text-xl' />
            <hr />
            <p>Customer : {modalType == 'normal' ? transactionDetailData.customer_name : <input type="text" name="customer_name" id="customer_name" value={transactionDetailData.customer_name} className='min-w-[20px] max-w-[24px] text-center focus:ring-0 focus:outline-none' onChange={(e) => setTransactionDetailData(prev => ({ ...prev, customer_name: e.target.value }))} />}</p>
            {
                transactionDetailData.products_detail.map((item, index) => (
                    <div className="w-full h-[100px] border bg-white rounded-lg p-2 flex gap-x-3 relative" key={index}>
                        <div className="w-[80px] h-full rounded-md bg-zinc-100 border shrink-0"></div>
                        <div className="flex-1">
                            <h3 className='font-medium text-lg'>{item.name}</h3>
                            <p className='text-sm'>{formatToIDR(Number(item.price))}</p>
                        </div>
                        {modalType == 'normal' ?
                            <span className='text-xs absolute right-2 px-2 py-1 bg-green-300 rounded-full'>{item.quantity}</span>
                            :
                            <div className="flex items-center justify-center gap-x-2 self-end h-fit w-fit absolute bottom-2 right-2">
                                <Button className='px-2 py-1 h-fit' onClick={() => handleChangeProductQty(item.transaction_id, item.product_id, 'plus')}>+</Button>
                                <input type="text" name="quantity" id="quantity" value={item.quantity} className='min-w-[20px] max-w-[24px] text-center focus:ring-0 focus:outline-none' onChange={(e) => handleChangeProductQty(item.transaction_id, item.product_id, 'all', Number(e.target.value))} />
                                <Button className='px-2 py-1 h-fit' onClick={() => handleChangeProductQty(item.transaction_id, item.product_id, 'minus')}>-</Button>
                            </div>
                        }

                    </div>
                ))
            }
            {
                modalType === 'edit' && <div className="w-full flex gap-x-2">
                    <Button className='w-full bg-darkerMain hover:bg-[#76d69a]' onClick={() => handleEdit('edit')}>Edit</Button>
                    <Button className='w-full'>Close</Button>
                </div>
            }
        </Modal>
    </>
}

export default _ordersClient;