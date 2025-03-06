'use client'
import { DropdownContainer, DropdownItem, DropdownSettings } from '@/components/client/dropdown';
import Modal from '@/components/client/modal';
import Title from '@/components/client/title';
import { useModal } from '@/components/context/modalContext';
import { useSidebar } from '@/components/context/sidebarContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loading } from '@/components/ui/loading';
import { AttendanceInfo } from '@/helper/db/attendance';
import Flatpickr from 'react-flatpickr'
import "flatpickr/dist/flatpickr.min.css";
import TextareaAutosize from 'react-textarea-autosize'
import { Ban, ClockArrowDown, ClockArrowUp, FileCheck, History, MousePointerClick } from 'lucide-react';
import React, { FC, useEffect, useState } from 'react';
import { UserSafe } from '@/types/login';
import { Input } from '@/components/ui/input';
import TableSkeleton from '@/components/skeleton/TableSkeleton';

interface _attendanceClientProps {
    userId: string | number,
    allUsers?: UserSafe[]
}

const _attendanceClient: FC<_attendanceClientProps> = ({ userId, allUsers }) => {
    const { state: sidebarInfo } = useSidebar()
    return <>
        {sidebarInfo.role == 'admin' ? <AdminEmployeeAttendance allUsers={allUsers} /> : <EmployeeAttendance userId={userId} />}
    </>
}

interface EmployeeAttendanceProps {
    userId: string | number,
}

const EmployeeAttendance: FC<EmployeeAttendanceProps> = ({ userId }) => {
    // general state
    const { modalState, modalSetter } = useModal()
    const [loading, setLoading] = useState(true)
    const [attendnaceType, setAttendnaceType] = useState<'Attendance' | 'Permission'>('Attendance')
    const iconSize = 40;
    // attendance state
    const [employeeStatus, setEmployeeStatus] = useState<'clockin' | 'clockout' | 'finished'>('clockin')
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

    // permission state
    const [dateToLeave, setDateToLeave] = useState<Date | null>(null)
    const permissionInfoInit = {
        leaveType: '',
        leaveReason: '',
    }
    const [permissionInfo, setPermissionInfo] = useState(permissionInfoInit)
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
        if (attendnaceType == 'Permission') {
            setLoading(false)
            return
        }
        todayAttendanceInfo()
    }, [])
    useEffect(() => {
        if (dateToLeave) {
            console.log(dateToLeave);
        }

    }, [dateToLeave])
    return <>
        {
            loading ? <Loading size={50} className='fixed top-1/2 left-1/2 m-0' /> : <>
                <div className="w-full flex justify-start px-10 ">
                    <DropdownContainer appereance={<div className="w-fit h-full flex items-center px-5 cursor-pointer border py-1 rounded-sm ">{attendnaceType}</div>}>
                        <DropdownItem onClickCallback={() => setAttendnaceType('Attendance')}>Attendance</DropdownItem>
                        <DropdownItem onClickCallback={() => setAttendnaceType('Permission')}>Permission</DropdownItem>
                    </DropdownContainer>
                </div>
                {
                    attendnaceType == 'Attendance' ?
                        <>
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
                        :
                        <>
                            <form action="" className='p-5 border rounded-md bg-white min-w-[300px] h-fit shadow-sm space-y-5 *:space-y-3'>
                                <Title title='Apply For Leave' />
                                <section className='flex flex-col'>
                                    <Label htmlFor='date_range'>Choose Date</Label>
                                    <Flatpickr options={{ mode: 'range' }} className='border rounded-md px-2 py-1' onValueUpdate={(dates) => {
                                        if (dates.length === 2) setDateToLeave(dates);
                                    }} />
                                </section>
                                <section className='flex flex-col'>
                                    <Label htmlFor='date_range'>Choose Leave Type</Label>
                                    <DropdownContainer itemStyle='full' appereance={<div className='w-full h-8 border rounded-sm py-1 px-2'></div>}>
                                        <DropdownItem >test</DropdownItem>
                                    </DropdownContainer>
                                </section>
                                <section className='flex flex-col'>
                                    <Label htmlFor='date_range'>Leave Reason</Label>
                                    <TextareaAutosize className='resize-none border px-3 py-2 rounded-md' />
                                </section>
                            </form>
                        </>
                }
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


interface AdminEmployeeAttendanceProps {
    allUsers?: UserSafe[]
}

const AdminEmployeeAttendance: FC<AdminEmployeeAttendanceProps> = ({ allUsers }) => {
    type EmployeeAttendanceHistory = {
        id: string,
        name: string,
        clockin: string,
        clockout: string,
        status: string
    }
    // general
    const [loading, setLoading] = useState({
        leave: false
    })
    const { modalState, modalSetter } = useModal()
    const chartDataType = ['Year', 'Month', 'Date'] as const
    const [chartDataBy, setChartDataBy] = useState(chartDataType[0])
    // history
    const [employeeAttendanceHistory, setEmployeeAttendanceHistory] = useState<EmployeeAttendanceHistory[]>([])
    async function getAllAttendanceBy(option: (typeof chartDataType)[number]) {
        try {
            const response = await fetch('/api/attendance?option=all&allOption=date')
            if (!response.ok) throw new Error('Failed to fetch attendance data');
            const responseData = await response.json() as AttendanceInfo[]
            const groupedData = Object.values(
                responseData.reduce((acc, curr) => {
                    const dateKey = curr.date.split("T")[0]; // Ambil tanggal saja
                    const key = `${curr.userId}-${dateKey}`;
                    if (!acc[key]) {
                        acc[key] = { userid: curr.userId, date: dateKey, clockin: null, clockout: null };
                    }
                    if (curr.status === "clockin" && !acc[key].clockin) {
                        acc[key].clockin = curr.date;
                    }
                    if (curr.status === "clockout" && !acc[key].clockout) {
                        acc[key].clockout = curr.date;
                    }

                    return acc;
                }, {} as Record<string, { userid: string; date: string; clockin: string | null; clockout: string | null }>)
            );

            // const newEmployeeHistory = responseData.map(attendance => {
            //     const username = allUsers?.find(user => user.id === attendance.userId)?.username
            //     return { id: attendance.userId, name: username, clockin: attendance. }
            // })
            console.log(groupedData);
            console.log(responseData);

        } catch (error) {

        }
    }
    // leave type
    const [leaveState, setLeaveState] = useState({
        state: '',
        error: ''
    })
    const [leaveArrays, setLeaveArrays] = useState<{ name: string }[]>([])
    async function addLeaveType() {
        try {
            if (leaveState.state.length <= 0) throw new Error('Empty value')
            const response = await fetch('/api/attendance/type', {
                method: 'POST',
                body: JSON.stringify({ name: leaveState.state })
            })
            if (!response.ok) throw new Error(response.statusText)
            setLeaveArrays(prev => ([...prev, { name: leaveState.state }]))
        } catch (error) {
            console.log(error);
        } finally {
            setLeaveState(prev => ({ ...prev, state: '' }))
            modalSetter('state', !modalState.isOpen)
        }
    }
    async function getAllLeaveTypes() {
        try {
            const response = await fetch('/api/attendance/type')
            setLoading(prev => ({ ...prev, leave: true }))
            if (!response.ok) throw new Error(response.statusText)
            const responseData = await response.json()
            setLeaveArrays(responseData)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(prev => ({ ...prev, leave: false }))
        }
    }

    // effects
    useEffect(() => {
        getAllAttendanceBy(chartDataBy)
        getAllLeaveTypes()
    }, [])
    useEffect(() => {
        console.log(leaveArrays);

    }, [leaveArrays])

    return <div className='px-10 w-full space-y-20 pb-20'>
        <section className='w-full space-y-5'>
            <div className="">
                <Title title='Employee' />
            </div>
            <div className='w-full flex gap-x-10 overflow-x-auto scrollbar-thin'>
                {
                    allUsers && allUsers.map((user, index) => (
                        <Card className='w-[200px] h-[200px] shrink-0 flex flex-col items-center justify-center' key={index}>
                            <div className="w-[100px] h-[100px] rounded-full bg-zinc-100"></div>
                            <h2 className='text-lg font-semibold capitalize mt-5'>{user.username}</h2>
                            <p className='capitalize'>{user.role}</p>
                        </Card>
                    ))
                }
            </div>
            <div className="w-full flex justify-between">
                <div className="">
                    <DropdownContainer appereance={<div className="w-full h-full flex items-center px-5 cursor-pointer border py-1 rounded-sm ">{chartDataBy}</div>}>
                        {
                            chartDataType.map((item, index) => (<DropdownItem key={index} onClickCallback={() => setChartDataBy(item)}>{item}</DropdownItem>))
                        }
                    </DropdownContainer>
                </div>
                {/* detailed feature */}

                {/* <div className="flex space-x-2">
                    <DropdownContainer appereance={<div className="w-full h-full flex items-center px-5 cursor-pointer border py-1 rounded-sm">{dateToFilter.year}</div>}>
                        {
                            years.map((item, index) => (<DropdownItem key={index} onClickCallback={() => setDateToFilter(prev => ({ ...prev, year: item }))}>{item}</DropdownItem>))
                        }
                    </DropdownContainer>
                    <DropdownContainer disabled={chartDataBy == 'Year'} appereance={<div className="w-full h-full flex items-center px-5 cursor-pointer border py-1 rounded-sm">{dateToFilter.month}</div>}>
                        {
                            months.map((item, index) => (<DropdownItem key={index} onClickCallback={() => setDateToFilter(prev => ({
                                ...prev, month: item.name
                            }))}>{item.name}</DropdownItem>))
                        }
                    </DropdownContainer >
                    <DropdownContainer disabled={chartDataBy == 'Year' || chartDataBy === 'Month'} appereance={<div className="w-full h-full flex items-center px-5 cursor-pointer border py-1 rounded-sm">{dateToFilter.date}</div>}>
                        {
                            getDaysInMonth(dateToFilter.year, 2).map((item, index) => (<DropdownItem key={index} onClickCallback={() => setDateToFilter(prev => ({ ...prev, date: item }))}>{item}</DropdownItem>))
                        }
                    </DropdownContainer>
                </div> */}

            </div>

            <table className='w-full mt-10 max-h-[300px] table-fixed'>
                <thead>
                    <tr className='h-fit bg-darkerMain text-white'>
                        <th>Name</th>
                        <th>Clockin</th>
                        <th>Clockout</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody className='h-fit'>
                    {
                        employeeAttendanceHistory && employeeAttendanceHistory.map((employee, index) => (
                            <tr className='text-center transition-300 hover:bg-zinc-100 cursor-pointer' key={index}>
                                <td>{employee.name}</td>
                                <td>{employee.clockin}</td>
                                <td>{employee.clockOut}</td>
                                <td>{employee.stauts}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </section>
        <section className="w-full space-y-5 ">
            <div className=' p-5 bg-zinc-100 space-y-5 min-h-[50%] max-h-[80%] overflow-y-auto shadow-sm border rounded-sm'>
                <h1 className='text-slate-400 font-light tracking-wider text-lg'>Add or edit leave type.</h1>
                {loading.leave ? <TableSkeleton /> : leaveArrays.map((item, index) => (
                    <div key={index} className="w-full h-10 bg-white border-slate-300 border-[2px] rounded-md flex *:gap-x-3 items-center px-5 justify-between">
                        <span className='flex items-center'>
                            <Ban />
                            <p className='font-semibold text-slate-500 capitalize'>{item.name}</p>
                        </span>
                        <DropdownSettings >
                            <DropdownItem>
                                Edit
                            </DropdownItem>
                            <DropdownItem >
                                Delete
                            </DropdownItem>
                        </DropdownSettings>
                    </div>
                ))}

                <Button className='w-full' onClick={() => modalSetter('state', !modalState.isOpen)}>Create New </Button>
            </div>
        </section>
        <Modal>
            <div className='space-y-3'>
                <Label htmlFor='leave_name' >
                    Leave Type
                </Label>
                <Input type='text' name='leave_name' placeholder='Leave name..' autoComplete='off' value={leaveState.state} onChange={(e) => setLeaveState(prev => ({ ...prev, state: e.target.value }))} />
                {/* {
                    message.error.category && <ErrorText className="self-start">{message.error.category}</ErrorText>
                } */}
                <Button className='w-full' onClick={() => addLeaveType()}>Create</Button>
            </div>
        </Modal>
    </div>;
}







export default _attendanceClient;