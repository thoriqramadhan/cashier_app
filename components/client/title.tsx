import { cn } from '@/lib/className';
import { FC } from 'react';

interface TitleProps {
    title: string,
    desc?: string,
    className?: string
}

const Title: FC<TitleProps> = ({ title, desc, className }) => {
    return <div className={cn(className)}>
        <h3 className='text-slate-900 font-semibold'>{title}</h3>
        {desc && <p className='text-sm font-thin'>{desc}</p>}
    </div>
}

export default Title;