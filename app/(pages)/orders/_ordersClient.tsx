'use client'
import Modal from '@/components/client/modal';
import { useModal } from '@/components/context/modalContext';
import { formatToIDR } from '@/lib/utils';
import { FC, useState } from 'react';
import Title from '@/components/client/title';
import { TransactionProductData } from '@/types/transaction';
import { DropdownItem, DropdownSettings } from '@/components/client/dropdown';
import { Check, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface _ordersClientProps {
}

const _ordersClient: FC<_ordersClientProps> = ({ }) => {
    const { modalSetter, modalState } = useModal()
    const transactionDetailDataInit: { customer_name: string, products_detail: TransactionProductData[], transaction_id: string } = {
        customer_name: '',
        transaction_id: '0',
        products_detail: []
    }
    const [transactionDatas, setTransactionDatas] = useState(JSON.parse(localStorage.getItem('transaction')) ?? [])
    console.log(transactionDatas);

    const [transactionDetailData, setTransactionDetailData] = useState(transactionDetailDataInit)
    const date = new Date();
    function openTransactionDetail(id: string) {
        const transactionProductDatas = JSON.parse(localStorage.getItem('transaction_detail')) ?? []
        const customer_name = transactionDatas.filter(item => item.id === id)[0].customer_name
        const products_detail = transactionProductDatas.filter(item => item.transaction_id === id)
        console.log(transactionProductDatas);

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
                <DropdownItem icon={<Trash2 />} >Delete</DropdownItem>
                <DropdownItem icon={<Pencil />}>Edit</DropdownItem>
                <DropdownItem icon={<Check />} onClickCallback={() => addToHistory()}>Done</DropdownItem>
            </DropdownSettings>
            <Title title='Transaction Detail' className='text-xl' />
            <hr />
            <p>Customer : {transactionDetailData.customer_name}</p>
            {
                transactionDetailData.products_detail.map((item, index) => (
                    <div className="w-full h-[100px] border bg-white rounded-lg p-2 flex gap-x-3 relative" key={index}>
                        <div className="w-[80px] h-full rounded-md bg-zinc-100 border shrink-0"></div>
                        <div className="flex-1">
                            <h3 className='font-medium text-lg'>{item.name}</h3>
                            <p className='text-sm'>{formatToIDR(Number(item.price))}</p>
                        </div>
                        <span className='text-xs absolute right-2 px-2 py-1 bg-green-300 rounded-full'>{item.quantity}</span>
                    </div>
                ))
            }
        </Modal>
    </>
}

export default _ordersClient;