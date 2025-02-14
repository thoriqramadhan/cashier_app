'use client'
import { DropdownItem, DropdownSettings } from '@/components/client/dropdown';
import Modal from '@/components/client/modal';
import { useModal } from '@/components/context/modalContext';
import { ErrorText } from '@/components/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryResponse } from '@/helper/db/category';
import { createCategory, deleteCategory } from '@/lib/action/category';
import { Label } from '@radix-ui/react-label';
import { Ban } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, FormEvent, useState } from 'react';
import { z } from 'zod';

interface _categoryClientProps {
    categoryDatas: CategoryResponse[]
}

export const _categoryClient: FC<_categoryClientProps> = ({ categoryDatas }) => {
    const messageInitialState = {
        status: 200,
        error: {
            category: '',
        }
    }

    const router = useRouter()
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
        router.refresh()
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
                <Input type='text' name='category_name' placeholder='category name..' autoComplete='off' />
                {
                    message.error.category && <ErrorText className="self-start">{message.error.category}</ErrorText>
                }
                <Button className='w-full'>Create</Button>
            </form>
        </Modal>
        <div className='mx-5 p-5 bg-zinc-100 space-y-5 min-h-[50%] max-h-[80%] overflow-y-auto shadow-sm border rounded-sm'>
            <h1 className='text-slate-400 font-light tracking-wider text-lg'>Add or edit product category.</h1>
            {categoryDatas.length > 0 ? categoryDatas.map((category, index) => (
                <CategoryItem name={category.name} key={index} />
            )) : <p>No category created.</p>
            }
            <Button className='w-full' onClick={() => modalSetter('state', !modalState.isOpen)}>Create New </Button>
        </div>
    </>
}



interface CategoryItemProps {
    name: string
}

const CategoryItem: FC<CategoryItemProps> = ({ name }) => {
    const iconSize = 17;
    const iconColor = '#64748b'
    const router = useRouter()
    async function handleDelete() {
        const deleteResponse = await deleteCategory(name);
        if (deleteResponse.status == 200) {
            router.refresh()
        } else {
            console.log('Failed to delete');

        }
    }
    return <div className="w-full h-10 bg-white border-slate-300 border-[2px] rounded-md flex *:gap-x-3 items-center px-5 justify-between">
        <span className='flex items-center'>
            <Ban size={iconSize} color={iconColor} />
            <p className='font-semibold text-slate-500 capitalize'>{name}</p>
        </span>
        <DropdownSettings >
            <DropdownItem>
                Edit
            </DropdownItem>
            <DropdownItem onClickCallback={() => handleDelete()}>
                Delete
            </DropdownItem>
        </DropdownSettings>
    </div>
}
