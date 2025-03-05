'use client'
import TableSkeleton from '@/components/skeleton/TableSkeleton';
import TitleSkeleton from '@/components/skeleton/TitleSkeleton';
import { FC } from 'react';

interface LoadingProps {

}

const Loading: FC<LoadingProps> = ({ }) => {
    return <div className='px-5 w-full my-5 relative space-y-10'>
        <TitleSkeleton />
        <TableSkeleton />
    </div>;
}

export default Loading;