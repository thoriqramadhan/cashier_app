import Title from '@/components/client/title';
import { ErrorText } from '@/components/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loading } from '@/components/ui/loading';
import { AuthInfoPayload } from '@/types/session';
import { Label } from '@radix-ui/react-label';
import Error from 'next/error';
import { FC, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface _taxSettingsProps {
    authInfo: AuthInfoPayload
}

const _taxSettings: FC<_taxSettingsProps> = ({ authInfo }) => {
    const [tax, setTax] = useState(0)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const handleTaxClient = (value: number) => {
        if (value < 0) {
            return
        }
        setTax(Number(value))
    }
    async function handleTaxServer() {
        try {
            if (tax <= 0) {
                return
            }
            const response = await fetch('/api/tax', {
                method: 'PATCH',
                body: JSON.stringify({ tax })
            })
            if (!response.ok) throw new Error('failed')
            setMessage('Success changing tax value')
        } catch (error) {
            setMessage('Failed changing tax value')
            console.log(error);

        }
    }
    if (authInfo.role !== 'admin') {
        return <p>Unauthorized</p>
    }
    useEffect(() => {
        const fetchTax = async () => {
            try {
                const response = await fetch('/api/tax')
                if (!response.ok) throw new Error(response.statusText)
                const responseData = await response.json()
                setTax(responseData.data[0].value)

            } catch (error) {
                console.log(error);

            } finally {
                setLoading(false)
            }
        }
        fetchTax()
    }, [])
    if (loading) return <Loading />
    return <div>
        <Title title='Tax' desc='Page for controlling your product tax' />
        <div className="flex gap-x-4 mt-2">
            <Input name='tax' type='number' value={tax} className='w-fit' onChange={(e) => handleTaxClient(Number(e.target.value))} />
            <Button onClick={() => handleTaxServer()}>Change</Button>
        </div>
        {message.length > 0 && <ErrorText>{message}</ErrorText>}
    </div>;
}

export default _taxSettings;