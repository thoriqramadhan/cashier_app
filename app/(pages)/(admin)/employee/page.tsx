'use client'
import { ErrorText } from '@/components/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loading } from '@/components/ui/loading';
import { register } from '@/lib/action/register';
import { changeEmployeeDataArgs } from '@/types/register';
import { Label } from '@radix-ui/react-label';
import { FC, FormEvent, useEffect, useState } from 'react';
import { z } from 'zod';

interface PageProps {

}

const Page: FC<PageProps> = ({ }) => {
    const messageInitialState = {
        status: 200,
        error: {
            email: '',
            password: '',
            name: ''
        }
    }
    const employeeDataInit = {
        name: '',
        email: '',
        password: ''
    }
    const [message, setMessage] = useState(messageInitialState)
    const [employeeData, setEmployeeData] = useState(employeeDataInit)
    const [isLoading, setIsLoading] = useState(false)
    function checkIsDataValid({ name, email, password }): validationResponse {
        const emailResponse = z.string().email().safeParse(email)
        const passwordResponse = z.string().min(8).safeParse(password)
        const nameResponse = z.string().min(3).safeParse(name)
        let status = 200;
        if (!emailResponse.success) {
            setMessage(prev => {
                return {
                    ...prev,
                    error: {
                        ...prev.error,
                        email: emailResponse.error.errors[0].message
                    }
                }
            })
            status = 400;
        }
        if (!passwordResponse.success) {
            console.log(passwordResponse.error);
            setMessage(prev => {
                return {
                    ...prev,
                    error: {
                        ...prev.error,
                        password: passwordResponse.error.errors[0].message
                    }
                }
            })
            status = 400;
        }
        if (!nameResponse.success) {
            console.log(nameResponse.error);
            setMessage(prev => {
                return {
                    ...prev,
                    error: {
                        ...prev.error,
                        name: nameResponse.error.errors[0].message
                    }
                }
            })
            status = 400;
        }
        return { status }
    }
    function changeEmployeeData(arg: changeEmployeeDataArgs) {
        setEmployeeData(prev => (
            {
                ...prev,
                ...arg
            }
        ))
    }
    useEffect(() => {
        console.log(message);

    }, [message])
    async function handleCreateEmployee(event: FormEvent) {
        event.preventDefault()
        const form = event.target
        const formData = new FormData(form)
        // validate on client
        const { name, email, password } = { name: formData.get('name'), email: formData.get('email'), password: formData.get('password') };
        const validationResult = checkIsDataValid({ name, email, password })
        if (validationResult.status == 400) return;
        console.log(validationResult);

        setIsLoading(true)

        const result = await register({ name, email, password });
        console.log(result);
        if (result.status == 400) {
            setMessage(prev => (
                {
                    status: prev.status,
                    error: result.error
                }
            ))
        } else {
            setMessage(prev => (
                {
                    status: prev.status,
                    error: result.error
                }
            ))
            setEmployeeData(employeeDataInit)
        }
        setIsLoading(false)
    }
    return <section className='w-full px-5 space-y-5'>
        <form onSubmit={handleCreateEmployee}>
            <div className="">
                <h3 className='text-slate-900 font-semibold'>Add Employee</h3>
                <p className='text-sm font-thin'>Employee management</p>
            </div>
            <div className="w-[70%] space-y-3">
                <Label>Username</Label>
                <Input name='name' type='text' id='name' value={employeeData.name} onChange={(e) => changeEmployeeData({ name: e.target.value })} />
                {
                    message.error.name && <ErrorText className="self-start">{message.error.name}</ErrorText>
                }
                <div className="w-full flex space-x-3">
                    <div className='space-y-1 flex-1'>
                        <Label>Email</Label>
                        <Input name='email' type='text' id='email' value={employeeData.email} onChange={(e) => changeEmployeeData({ email: e.target.value })} />
                        {
                            message.error.email && <ErrorText className="self-start">{message.error.email}</ErrorText>
                        }
                    </div>
                    <div className='space-y-1 flex-1'>
                        <Label>Password</Label>
                        <Input name='password' type='text' id='password' value={employeeData.password} onChange={(e) => changeEmployeeData({ password: e.target.value })} />
                        {
                            message.error.password && <ErrorText className="self-start">{message.error.password}</ErrorText>
                        }
                    </div>
                </div>
                <Button className='w-full' disabled={isLoading}>{isLoading ? <Loading /> : 'Add'}</Button>
                {
                    message?.success && <ErrorText className="self-start">{message?.success}</ErrorText>
                }
            </div>
        </form>
    </section>
}

export default Page;