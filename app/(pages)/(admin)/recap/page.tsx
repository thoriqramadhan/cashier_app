import Title from '@/components/client/title';
import { getTransactionRecap, getTransactionRecapByMonth } from '@/helper/db/transaction';
import { formatToIDR } from '@/lib/utils';
import _recapClient from './_recapClient';
import { FC } from 'react';

interface PageProps {

}

const Page: FC<PageProps> = async ({ }) => {
    const date = new Date()
    const yearNow = date.getFullYear().toString();
    const monthNow = date.toLocaleString('en-US', { month: '2-digit' }).toString()
    const dateNow = date.toLocaleString('en-US', { day: '2-digit' })

    const yearlyRecap = await getTransactionRecap(yearNow)

    const totalYearIncome = yearlyRecap.reduce((prev, current) => (Number(current.total_income) + prev), 0)

    const monthlyRecap = await getTransactionRecap(yearNow, monthNow)
    const totalMonthIncome = monthlyRecap.reduce((prev, current) => (Number(current.total_income) + prev), 0)
    const dailyRecap = await getTransactionRecap(yearNow, monthNow, dateNow)
    const totalDailyIncome = dailyRecap.reduce((prev, current) => (Number(current.total_income) + prev), 0)


    return <div className="px-5 w-full my-5 relative">
        <div className="w-full flex h-[150px] gap-x-5">
            <div className="flex-1 rounded-lg shadow-sm bg-white border flex items-center justify-center flex-col p-5">
                <Title title='Yearly' />
                <h1 className='text-lg font-semibold'>{formatToIDR(Number(totalYearIncome))}</h1>
            </div>
            <div className="flex-1 rounded-lg shadow-sm bg-white border flex items-center justify-center flex-col p-3">
                <Title title='Monthly' />
                <h1 className='text-lg font-semibold'>{formatToIDR(Number(totalMonthIncome))}</h1>
            </div>
            <div className="flex-1 rounded-lg shadow-sm bg-white border flex items-center justify-center flex-col p-3">
                <Title title='Daily' />
                <h1 className='text-lg font-semibold'>{formatToIDR(Number(totalDailyIncome))}</h1>
            </div>
        </div>
        <div className="w-full space-y-5 mt-5">
            <Title title='Income Recap' desc='Income recap is available by yearly , monthly , date' />
            <_recapClient />
        </div>
    </div>
}

export default Page;