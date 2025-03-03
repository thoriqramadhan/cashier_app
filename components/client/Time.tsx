'use client'
import { FC, useEffect, useState } from 'react';
import { Loading } from '../ui/loading';
import { cn } from '@/lib/className';

interface TimeProps {
    className?: string
}

const Time: FC<TimeProps> = ({ className }) => {
    const [timeNow, setTimeNow] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
    useEffect(() => {
        const dateNow = new Date();
        setTimeNow({
            hours: dateNow.getHours(),
            minutes: dateNow.getMinutes(),
            seconds: dateNow.getSeconds(),
        });
        const interval = setInterval(() => {
            setTimeNow(prev => {
                if (!prev) return prev;
                let hours = prev.hours
                let minutes = prev.minutes
                let seconds = prev.seconds + 1;
                if (seconds === 60) {
                    seconds = 0
                    minutes += 1
                }
                if (minutes === 60) {
                    minutes = 0
                    hours += 1
                }
                if (hours === 24) {
                    hours = 0
                }
                return { hours, minutes, seconds }
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [])
    if (!timeNow) return <Loading />
    return <h1 className={cn('text-4xl font-semibold', className)}>{timeNow.hours}:{timeNow.minutes}:{timeNow.seconds}</h1>;
}

export default Time;