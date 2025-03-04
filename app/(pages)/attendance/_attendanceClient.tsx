'use client'
import Modal from '@/components/client/modal';
import { useModal } from '@/components/context/modalContext';
import { useSidebar } from '@/components/context/sidebarContext';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { AttendanceInfo } from '@/helper/db/attendance';
import { ClockArrowDown, ClockArrowUp, FileCheck, History, MousePointerClick } from 'lucide-react';
import React, { FC, useEffect, useState } from 'react';

interface _attendanceClientProps {
    userId: string | number
}

const _attendanceClient: FC<_attendanceClientProps> = ({ userId }) => {
    const { state: sidebarInfo } = useSidebar()
    return <>
        {sidebarInfo.role == 'admin' ? 'Halo Admin' : <EmployeeAttendance userId={userId} />}
    </>
}

interface EmployeeAttendanceProps {
    userId: string | number
}

const EmployeeAttendance: FC<EmployeeAttendanceProps> = ({ userId }) => {
    const { modalState, modalSetter } = useModal()
    const [employeeStatus, setEmployeeStatus] = useState<'clockin' | 'clockout' | 'finished'>('clockin')
    const [loading, setLoading] = useState(true)
    const iconSize = 40;
    const isFinished = employeeStatus == 'finished'
    const attendanceStatusInit = [
        {
            title: 'Check In',
            icon: <ClockArrowDown />,
            value: ''
        },
        {
            title: 'Check Out',
            icon: <ClockArrowUp />,
            value: ''
        },
        {
            title: 'Working Time',
            icon: <History />,
            value: ''
        },

    ]
    const [attendanceStatus, setAttendanceStatus] = useState(attendanceStatusInit)
    async function handleAttendance(option: 'clockin' | 'clockout') {
        try {
            const response = await fetch(`/api/attendance?option=${option}`, {
                method: 'POST'
            })
            if (!response.ok) throw new Error('Faileddd')
            const responseData = await response.json()
            if (responseData.status == 200) {
                if (option == 'clockout') {
                    setEmployeeStatus('finished')
                } else {
                    setEmployeeStatus('clockout')
                }
                modalSetter('state', !modalState)
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        const todayAttendanceInfo = async () => {
            try {
                const response = await fetch(`/api/attendance?option=userId&userId=${userId}`)
                if (!response.ok) throw new Error(response.statusText)
                const responseData = await response.json() as AttendanceInfo[]
                const isAlreadyClockIn = responseData.find(attendance => attendance.status === 'clockin')
                if (isAlreadyClockIn) setEmployeeStatus('clockout')
                const isAlreadyClockOut = responseData.find(attendance => attendance.status === 'clockout')
                if (isAlreadyClockOut) setEmployeeStatus('finished')
                let workingTime = null;
                if (isAlreadyClockIn && isAlreadyClockOut) {
                    const clockInTime = new Date(isAlreadyClockIn.date).getTime();
                    const clockOutTime = new Date(isAlreadyClockOut.date).getTime();

                    const diffMs = clockOutTime - clockInTime; // Selisih dalam milidetik
                    const hours = Math.floor(diffMs / (1000 * 60 * 60)); // Konversi ke jam
                    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); // Sisa menit
                    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000); // Sisa detik
                    workingTime = `${hours}h ${minutes}m ${seconds}s`;
                }
                console.log(isAlreadyClockOut?.date, isAlreadyClockIn);

                setAttendanceStatus(prev => prev.map((attendance, index) => {
                    if (index == 0 && isAlreadyClockIn) return {
                        ...attendance, value: new Date(isAlreadyClockIn.date).toLocaleString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        })
                    }
                    if (index == 1 && isAlreadyClockOut) return {
                        ...attendance, value: new Date(isAlreadyClockOut.date).toLocaleString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        })
                    }
                    if (index == 2 && workingTime) return { ...attendance, value: workingTime }
                    return attendance
                }))
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        }
        todayAttendanceInfo()
    }, [])
    useEffect(() => {
        console.log(attendanceStatus);

    }, [attendanceStatus])
    return <>
        {
            loading ? <Loading size={50} className='fixed top-1/2 left-1/2 m-0' /> : <>
                <div className={`w-[200px] h-[200px]  border-[4px] rounded-2xl flex flex-col items-center justify-center bg-gradient-to-b ${employeeStatus === 'clockin' || employeeStatus === 'finished' ? 'from-[rgba(220,252,231,0.3)] to-[rgba(134,239,172,1)]' : 'from-white to-black'} shadow-md cursor-pointer`} onClick={() => modalSetter('state', !modalState.isOpen)}>
                    {isFinished ? <FileCheck size={80} color='white' /> :
                        <MousePointerClick size={80} color='white' />
                    }
                    <p className='text-white font-semibold text-lg mt-2'>{employeeStatus === 'clockin' ? 'Clock In' : isFinished ? 'Finished' : 'Clock Out'}</p>
                </div>
                <div className="flex gap-x-12">
                    {
                        attendanceStatus?.length > 0 && attendanceStatus.map((item, index) => {
                            console.log(item);

                            return (
                                <div className="text-center flex flex-col items-center justify-center space-y-1" key={index}>
                                    {
                                        React.cloneElement(item.icon, { size: iconSize, className: 'text-darkerMain' })
                                    }
                                    <p className='text-md font-semibold'>{item.value ? item.value : '--:--'}</p>
                                    <p className='text-sm text-gray-500'>{item.title}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </>
        }
        {employeeStatus != 'finished' &&
            <Modal>
                {/* <b>{employeeStatus === 'clockin' ? 'Clock In' : 'Clock Out'} At : {new Date().toLocaleString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}?</b> */}
                <div className="flex space-x-2 mt-5">
                    <Button className='w-full' onClick={() => handleAttendance(employeeStatus)}>Sure</Button>
                    <Button className='w-full' onClick={() => modalSetter('state', !modalState.isOpen)}>No</Button>
                </div>
            </Modal>
        }
    </>
}






export default _attendanceClient;