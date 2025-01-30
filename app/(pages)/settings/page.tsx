import { getAuthInfo } from '@/lib/auth/jwt';
import { FC } from 'react';

interface PageProps {

}

const Page: FC<PageProps> = async ({ }) => {
    const authInfo = await getAuthInfo();
    console.log(authInfo);

    return <div>Page</div>;
}

export default Page;