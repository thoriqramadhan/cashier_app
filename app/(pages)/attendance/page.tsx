import Time from '@/components/client/Time';
import _attendanceClient from './_attendanceClient';
import { FC } from 'react';
import { getAuthInfo } from '@/lib/auth/jwt';
import { getAllUsers } from '@/helper/db/users';

interface PageProps {

}

const Page: FC<PageProps> = async ({ }) => {
    const authInfo = await getAuthInfo()
    const allUsers = await getAllUsers()
    const filterdUsers = allUsers.filter(user => user.role !== 'admin').map(user => ({ id: user.id, username: user.username, role: user.role }))
    const dateNow = new Date();
    const date = dateNow.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' })
    const dayNow = dateNow.toLocaleString('en-US', { weekday: 'long' })
    return <article className='w-full'>
        <section className="w-full flex flex-col justify-center items-center space-y-10">
            <div className="text-center ">
                <Time />
                <h2>{dayNow}, {date}</h2>
            </div>
            <_attendanceClient userId={authInfo.id} allUsers={filterdUsers} />
        </section>
    </article>;
}

export default Page;