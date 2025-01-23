'use client'
import { usePathname } from 'next/navigation';
import { FC } from 'react';

interface BreadcrumbsProps {

}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ }) => {
    const pathName = (usePathname()).split('/').filter(item => item.length > 0) ?? []
    return <>
        {pathName && pathName.map((item, index) => (
            <p className='capitalize' key={index}>{item}</p>
        ))}
    </>
}

export default Breadcrumbs;