'use client'
import { DropdownSettings } from '@/components/client/dropdown';
import Modal from '@/components/client/modal';
import { useModal } from '@/components/context/modalContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Ban } from 'lucide-react';
import { FC } from 'react';

interface PageProps {

}

const Page: FC<PageProps> = ({ }) => {
    const { modalState, modalSetter } = useModal()
    return <>
        <Modal>
            <form action="" className='space-y-3'>
                <Label htmlFor='category_name'>
                    Category Name
                </Label>
                <Input type='text' name='category_name' placeholder='category name..' />
                <Button className='w-full'>Create</Button>
            </form>
        </Modal>
        <div className='mx-5 p-5 bg-zinc-100 space-y-5 min-h-[50%] max-h-[80%] overflow-y-auto shadow-sm border rounded-sm'>
            <h1 className='text-slate-400 font-light tracking-wider text-lg'>Add or edit product category.</h1>
            <CategoryItem />
            <CategoryItem />
            <Button className='w-full' onClick={() => modalSetter('state', !modalState.isOpen)}>Create New </Button>
            {/* {
            Array.from({ length: 10 }).map((item, index) => (
            ))
        } */}
        </div>
    </>
}



interface CategoryItemProps {

}

const CategoryItem: FC<CategoryItemProps> = ({ }) => {
    const iconSize = 17;
    const iconColor = '#64748b'
    return <div className="w-full h-10 bg-white border-slate-300 border-[2px] rounded-md flex *:gap-x-3 items-center px-5 justify-between">
        <span className='flex items-center'>
            <Ban size={iconSize} color={iconColor} />
            <p className='font-semibold text-slate-500'>Food</p>
        </span>
        <DropdownSettings />
    </div>
}


export default Page;