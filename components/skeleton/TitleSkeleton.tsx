import { FC } from 'react';

interface TitleSkeletonProps {

}

const TitleSkeleton: FC<TitleSkeletonProps> = ({ }) => {
    return <div className="w-[300px] space-y-2">
        <div className="w-[100px] h-[24px] skeleton"></div>
        <div className="w-[200px] h-[20px] skeleton"></div>
    </div>
}

export default TitleSkeleton;