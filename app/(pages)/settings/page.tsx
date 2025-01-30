import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAuthInfo } from '@/lib/auth/jwt';
import _profileSettings from './_settingsComponents/_profileSettings';
import { FC } from 'react';
import { boolean } from 'zod';

interface PageProps {

}

const Page: FC<PageProps> = async ({ }) => {
    const authInfo = await getAuthInfo();
    return <div className='px-5 w-full'>
        <div className="w-full flex gap-x-3 my-5">
            {Array.from({ length: 3 }).map((item, index) => (
                <span className='block bg-zinc-50 px-5 py-2 rounded-full text-slate-700 font-medium cursor-pointer transition-300 hover:bg-black/80 hover:text-white' key={index}>
                    item
                </span>
            ))}
        </div>
        <div className="">
            <h3 className='text-slate-900 font-semibold'>Profile</h3>
            <p className='text-sm font-thin'>Set yout account detail.</p>
        </div>
        <_profileSettings authInfo={authInfo} />
    </div>;
}

export default Page;