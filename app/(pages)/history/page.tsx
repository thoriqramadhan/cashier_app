import Title from '@/components/client/title';
import { getAllTransactionProducts, getAllTransactions } from '@/helper/db/history';
import _historyClient from './_historyClient';
import { FC } from 'react';

interface HistoryProps {
}

const History: FC<HistoryProps> = async ({ }) => {
    const transactionDatas = await getAllTransactions()
    // const tes = new Promise((resolve) => {
    //     setTimeout(() => {
    //         resolve("da");
    //     }, 1000000); // 1000 detik (16 menit lebih)
    // });

    // throw tes;
    const transactionProductDatas = await getAllTransactionProducts()
    if (transactionDatas?.length == 0) {
        return <p>No datas</p>
    }

    return <div className='px-5 w-full my-5 relative'>
        <Title title='History' desc='All successfull transaction history.' />
        <_historyClient transactionDatas={transactionDatas} transactionProductDatas={transactionProductDatas} />
    </div>;
}

export default History;