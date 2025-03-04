'use client'
import { FC } from 'react';

interface TableSkeletonProps {

}

const TableSkeleton: FC<TableSkeletonProps> = ({ }) => {
    return <div className='w-full h-[200px] bg-zinc-100 skeleton'>
        <div className="w-full h-[26px] bg-zinc-200 skeleton"></div>
    </div>;
}

export default TableSkeleton;