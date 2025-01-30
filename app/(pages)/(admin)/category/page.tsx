'use client'
import { DropdownItem, DropdownSettings } from '@/components/client/dropdown';
import Modal from '@/components/client/modal';
import { useModal } from '@/components/context/modalContext';
import { ErrorText } from '@/components/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createCategory } from '@/lib/action/category';
import { Label } from '@radix-ui/react-label';
import { Ban } from 'lucide-react';
import { FC, FormEvent, FormEventHandler, useState } from 'react';
import { z } from 'zod';

interface PageProps {

}

const Page: FC<PageProps> = ({ }) => {
    const messageInitialState = {
        status: 200,
        error: {
            category: '',
        }
    }
    const { modalState, modalSetter } = useModal()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(messageInitialState)
    async function handleCreateCategory(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget;
        const formData = new FormData(form)
        const category = formData.get('category_name') as string;
        const clientValidationResult = checkIsDataValid(category)
        if (clientValidationResult.status === 400) {
            return;
        }
        const serverResult = await createCategory(category)

        if (serverResult?.status === 400) {
            setMessage({
                status: serverResult.status,
                error: serverResult.error
            })
        } else {
            setMessage(messageInitialState)
            modalSetter('state', !modalState.isOpen)
        }
    }
    function checkIsDataValid(category: string) {
        const categoryResponse = z.string().min(3).safeParse(category);
        let status = 200;
        if (!categoryResponse.success) {
            setMessage(prev => {
                return {
                    ...prev,
                    error: {
                        category: categoryResponse.error.errors[0].message
                    }
                }
            })
            status = 400;
        }
        return { status }
    }
    return <>
        <Modal>
            <form onSubmit={handleCreateCategory} className='space-y-3'>
                <Label htmlFor='category_name'>
                    Category Name
                </Label>
                <Input type='text' name='category_name' placeholder='category name..' />
                {
                    message.error.category && <ErrorText className="self-start">{message.error.category}</ErrorText>
                }
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
        <DropdownSettings >
            <DropdownItem>
                Edit
            </DropdownItem>
            <DropdownItem>
                Delete
            </DropdownItem>
        </DropdownSettings>
    </div>
}


export default Page;