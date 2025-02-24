import Title from '@/components/client/title';
import { FC } from 'react';
import _ordersClient from './_ordersClient';

interface PageProps {

}

const Page: FC<PageProps> = ({ }) => {
    return <div className='px-5 w-full my-5 relative'>
        <Title title='Orders' desc='All delayed transaction history.' />
        <_ordersClient />
    </div>;
}

export default Page;