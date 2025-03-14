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
import { Ban, Check, ClockArrowDown, ClockArrowUp, FileCheck, History, MousePointerClick } from 'lucide-react';
import React, { FC, useEffect, useState } from 'react';
import { UserSafe } from '@/types/login';
import { Input } from '@/components/ui/input';
import TableSkeleton from '@/components/skeleton/TableSkeleton';
import { ErrorText } from '@/components/text';

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
    const [dateToLeave, setDateToLeave] = useState<Date[] | null>(null)
    const [leaveTypes, setLeaveTypes] = useState<{ name: string }[]>([])
    const permissionErrorsInit = {
        date: '',
        leaveType: '',
        reason: ''
    }
    const [permissionErrors, setPermissionErrors] = useState(permissionErrorsInit)
    const permissionInfoInit = {
        leaveType: '',
        leaveReason: '',
        isLimit: false,
        limitInfo: {}
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
    async function handleLeaveApplicant() {
        try {
            const newDateToleave = dateToLeave.map(item => new Date(item).toISOString())
            if (newDateToleave.length > 2 || permissionInfo.leaveReason.length === 0 || permissionInfo.leaveReason.length === 0) {
                console.log('data harus di isi');
                return
            }
            const clientData = {
                user_id: userId,
                leave_category: permissionInfo.leaveType,
                reason: permissionInfo.leaveReason,
                leave_at: newDateToleave[0],
                back_at: newDateToleave[1]
            }
            const response = await fetch('/api/attendance/leave', {
                method: 'POST',
                body: JSON.stringify({ clientData })
            })
            let responseData;
            try {
                responseData = await response.json();
            } catch {
                responseData = { message: response.statusText };
            }
            if (!response.ok) throw new Error(responseData)
            setPermissionInfo(prev => ({
                ...prev,
                leaveReason: '',
                leaveType: leaveTypes[0].name
            }))
            setDateToLeave(null)
        } catch (error) {
            console.log(error.message);

        }
    }
    useEffect(() => {
        const todayAttendanceInfo = async () => {
            try {
                // fetch today attendance info by userID and date
                const response = await fetch(`/api/attendance?option=userId&userId=${userId}`)
                if (!response.ok) throw new Error(response.statusText)
                const responseData = await response.json() as AttendanceInfo[]
                // find data with status clockin
                const isAlreadyClockIn = responseData.find(attendance => attendance.status === 'clockin')
                // if faund set to clockout
                if (isAlreadyClockIn) setEmployeeStatus('clockout')
                // find data with status clockout
                const isAlreadyClockOut = responseData.find(attendance => attendance.status === 'clockout')
                // if faund set to finished
                if (isAlreadyClockOut) setEmployeeStatus('finished')
                let workingTime = null;
                // if both found get total working time
                if (isAlreadyClockIn && isAlreadyClockOut) {
                    const clockInTime = new Date(isAlreadyClockIn.date).getTime();
                    const clockOutTime = new Date(isAlreadyClockOut.date).getTime();

                    const diffMs = clockOutTime - clockInTime; // Selisih dalam milidetik
                    const hours = Math.floor(diffMs / (1000 * 60 * 60)); // Konversi ke jam
                    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); // Sisa menit
                    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000); // Sisa detik
                    workingTime = `${hours}h ${minutes}m ${seconds}s`;
                }
                // set status by index and available data
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
        const getLeaveTypes = async () => {
            try {
                const response = await fetch('/api/attendance/type')
                if (!response.ok) throw new Error(response.statusText)
                const responseData = await response.json() as { name: string }[]
                setLeaveTypes(responseData)
                setPermissionInfo(prev => ({ ...prev, leaveType: responseData[0].name }))
            } catch (error) {
                console.log(error);
            }
        }
        const getAttendanceLimitStatus = async () => {
            try {
                const dateNow = new Date()
                const formattedDate = new Intl.DateTimeFormat('sv-SE').format(dateNow)
                const response = await fetch(`/api/attendance/leave?option=check_limit&userId=${userId}&date=${formattedDate}`)
                if (!response.ok) throw new Error(response.statusText)
                const responseData = await response.json()
                console.log(responseData);

                setPermissionInfo(prev => ({ ...prev, isLimit: responseData.status, limitInfo: responseData.data ? responseData.data : {} }))
            } catch (error) {
                console.log(error);

            }
        }
        todayAttendanceInfo()
        getLeaveTypes()
        getAttendanceLimitStatus()
    }, [])
    useEffect(() => {
        console.log(permissionInfo);

    }, [permissionInfo])
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
                            <div className={`w-[200px] h-[200px]  border-[4px] rounded-2xl flex flex-col items-center justify-center bg-gradient-to-b ${employeeStatus === 'clockin' || employeeStatus === 'finished' ? 'from-[rgba(220,252,231,0.3)] to-[rgba(134,239,172,1)]' : 'from-white to-black'} shadow-md cursor-pointer`} onClick={() => {
                                if (!permissionInfo.limitInfo.status) {
                                    modalSetter('state', !modalState.isOpen)
                                }
                            }}>
                                {permissionInfo.limitInfo.status ? <Check color='white' size={80} /> : isFinished ? <FileCheck size={80} color='white' /> :
                                    <MousePointerClick size={80} color='white' />
                                }
                                <p className='text-white font-semibold text-lg mt-2'>{permissionInfo.limitInfo.status ? 'Approved' : employeeStatus === 'clockin' ? 'Clock In' : isFinished ? 'Finished' : 'Clock Out'}</p>
                            </div>
                            <div className="flex gap-x-12">
                                {
                                    permissionInfo.limitInfo.status ? 'Admin approved your leave request' : attendanceStatus?.length > 0 && attendanceStatus.map((item, index) => {
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
                        // UI leave applicant
                        <>
                            <article className='p-5 border rounded-md bg-white min-w-[300px] h-fit shadow-sm space-y-5 *:space-y-3'>
                                {
                                    permissionInfo.isLimit ? <div className='flex flex-col items-center justify-center gap-y-2 '>
                                        <Check size={50} />
                                        <span className='text-center'>
                                            <p>You have reached the limit today!</p>
                                            <p className='text-xs font-light mt-1 text-zinc-400'>Wait for admin to approved your request, <br /> check in attendance if approved it will change to check</p>
                                        </span>
                                    </div> : <>
                                        <Title title='Apply For Leave' desc='Setiap user hanya dapat mengirimkan izin 1x/hari' />
                                        {/* pilih tanggal */}
                                        <section className='flex flex-col'>
                                            <Label htmlFor='date_range'>Choose Date</Label>
                                            <Flatpickr options={{ mode: 'range' }} className='border rounded-md px-2 py-1' onValueUpdate={(dates) => {
                                                if (dates.length === 2) setDateToLeave(dates);
                                            }} />
                                            {
                                                permissionErrors.date && <ErrorText className="self-start">{permissionErrors.date}</ErrorText>
                                            }
                                        </section>
                                        {/* tipe izin */}
                                        <section className='flex flex-col'>
                                            <Label htmlFor='date_range'>Choose Leave Type</Label>
                                            <DropdownContainer itemStyle='full' appereance={<div className='w-full h-8 border capitalize rounded-sm py-1 px-2'>{permissionInfo.leaveType}</div>}>
                                                {
                                                    leaveTypes.length > 0 && leaveTypes.map((item, index) => (
                                                        <DropdownItem className='capitalize' key={index} onClickCallback={() => setPermissionInfo(prev => ({ ...prev, leaveType: item.name }))}>{item.name}</DropdownItem>
                                                    ))
                                                }
                                            </DropdownContainer>
                                            {
                                                permissionErrors.leaveType && <ErrorText className="self-start">{permissionErrors.leaveType}</ErrorText>
                                            }
                                        </section>
                                        {/* alasan izin */}
                                        <section className='flex flex-col'>
                                            <Label htmlFor='date_range'>Leave Reason</Label>
                                            <TextareaAutosize required className='resize-none border px-3 py-2 rounded-md' onChange={(e) => setPermissionInfo(prev => ({ ...prev, leaveReason: e.target.value }))} />
                                            {
                                                permissionErrors.reason && <ErrorText className="self-start">{permissionErrors.reason}</ErrorText>
                                            }
                                        </section>
                                        <Button className='w-full' onClick={() => handleLeaveApplicant()}>Submit</Button>
                                    </>
                                }
                            </article>
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
    const [modalType, setModalType] = useState<'create' | 'edit' | 'applicant'>('create')
    const chartDataType = ['Year', 'Month', 'Date'] as const
    const [chartDataBy, setChartDataBy] = useState(chartDataType[0])
    // history
    const [employeeAttendanceHistory, setEmployeeAttendanceHistory] = useState<EmployeeAttendanceHistory[]>([])
    // leave type
    const [leaveState, setLeaveState] = useState({
        state: '',
        error: ''
    })
    const [oldEditState, setOldEditState] = useState('')
    const [leaveArrays, setLeaveArrays] = useState<{ name: string }[]>([])
    // leave applicants
    const [leaveApplicants, setLeaveApplicants] = useState([])
    const leaveApplicantModalInit = {
        id: '',
        name: '',
        category: '',
        reason: '',
        leave_at: '',
        back_at: '',
        status: false,
        admin_msg: ''
    }
    const [leaveApplicantModal, setLeaveApplicantModal] = useState(leaveApplicantModalInit)

    // general functions
    function modalHandler(value: 'create' | 'edit' | 'applicant') {
        setModalType(value)
        modalSetter('state', !modalState.isOpen)
    }
    // leave type functions
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
            setLoading(prev => ({ ...prev, leave: true }))
            const response = await fetch('/api/attendance/type')
            if (!response.ok) throw new Error(response.statusText)
            const responseData = await response.json()
            setLeaveArrays(responseData)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(prev => ({ ...prev, leave: false }))
        }
    }
    async function deleteLeaveType(name: string) {
        try {
            const response = await fetch('/api/attendance/type', {
                method: 'DELETE',
                body: JSON.stringify({ name })
            })
            if (!response.ok) throw new Error(response.statusText)
            const responseData = await response.json()
            const newLeaveArrays = leaveArrays.filter(item => item.name !== name)
            setLeaveArrays(newLeaveArrays)
        } catch (error) {
            console.log(error);

        }
    }
    async function editLeaveType() {
        if (oldEditState == leaveState.state) {
            setLeaveState(prev => ({ ...prev, error: 'Leave type must be different' }))
            return;
        }
        try {
            const response = await fetch('/api/attendance/type', {
                method: 'PATCH',
                body: JSON.stringify({ oldState: oldEditState, newState: leaveState.state })
            })
            let responseData;
            try {
                responseData = await response.json();// Coba parse JSON
            } catch {
                responseData = { message: response.statusText }; // Jika gagal, fallback ke statusText
            }
            if (!response.ok) throw new Error(responseData.message || response.statusText)
            const newLeaveTypeArrays = leaveArrays.map(item => {
                if (item.name == oldEditState) {
                    return { name: leaveState.state }
                }
                return item
            })
            setLeaveArrays(newLeaveTypeArrays)
            setOldEditState('')
            modalSetter('state', !modalState)
        } catch (error) {
            setLeaveState(prev => ({ ...prev, error: error.message }))
            console.log(error.message);
        }

    }
    // applicant function
    async function responseLeaveRequest(option: 'init' | 'update', value?: {
        id: string,
        name: string;
        category: string;
        reason: string;
        leave_at: string;
        back_at: string;
        status: boolean;
        admin_msg: string;
    }) {
        try {
            if (option === 'init') {
                setLeaveApplicantModal(value)
            }
            if (option == 'update') {
                console.log(leaveApplicantModal);
                const response = await fetch('/api/attendance/leave', {
                    method: 'PATCH', body: JSON.stringify({
                        id: leaveApplicantModal.id, status: leaveApplicantModal.status, adminMsg: leaveApplicantModal.admin_msg
                    })
                })
                if (!response.ok) throw new Error(response.statusText)
                const responseData = await response.json()
                console.log(leaveApplicants);
                console.log(responseData);

            }
        } catch (error) {
            console.log(error);

        }
    }
    // init function
    // WIP -------------------------------
    async function getAllAttendanceBy(option: '') {
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
    async function getAllLeaveAttendanceRequest() {
        try {
            const response = await fetch('/api/attendance/leave?option=getAll')
            if (!response.ok) throw new Error(response.statusText)
            const responseData = await response.json()
            setLeaveApplicants(responseData)
            console.log(responseData);

        } catch (error) {
            console.log(error);

        }
    }

    // effects
    useEffect(() => {
        // getAllAttendanceBy(chartDataBy)
        getAllLeaveAttendanceRequest()
        getAllLeaveTypes()
    }, [])

    return <div className='px-10 w-full space-y-20 pb-20'>
        {/* employee attendace history */}
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
        {/* leave type */}
        <section className="w-full space-y-5 ">
            {
                loading.leave ? <TableSkeleton /> :
                    <div className=' p-5 bg-zinc-100 space-y-5 min-h-[50%] max-h-[80%] overflow-y-auto shadow-sm border rounded-sm'>
                        <h1 className='text-slate-400 font-light tracking-wider text-lg'>Add or edit leave type.</h1>
                        {leaveArrays.map((item, index) => (
                            <div key={index} className="w-full h-10 bg-white border-slate-300 border-[2px] rounded-md flex *:gap-x-3 items-center px-5 justify-between">
                                <span className='flex items-center'>
                                    <Ban />
                                    <p className='font-semibold text-slate-500 capitalize'>{item.name}</p>
                                </span>
                                <DropdownSettings >
                                    <DropdownItem onClickCallback={() => {
                                        setOldEditState(item.name)
                                        setLeaveState({
                                            error: '',
                                            state: item.name
                                        })
                                        modalHandler('edit')
                                    }}>
                                        Edit
                                    </DropdownItem>
                                    <DropdownItem onClickCallback={() => deleteLeaveType(item.name)}>
                                        Delete
                                    </DropdownItem>
                                </DropdownSettings>
                            </div>
                        ))}

                        <Button className='w-full' onClick={() => modalHandler('create')}>Create New </Button>
                    </div>
            }
        </section>
        {/* leave applicant */}
        <section>
            <Title title='Leave Applicant' desc='Your employee leave request you can accept or decline ( with description is an option )' />
            <table className='w-full mt-10 max-h-[300px] table-fixed'>
                <thead>
                    <tr className='h-fit bg-darkerMain text-white'>
                        <th>Category</th>
                        <th>Reason</th>
                        <th>LeaveAt</th>
                        <th>BackAt</th>
                        <th>Status</th>
                        <th>Admin Message</th>
                    </tr>
                </thead>
                <tbody className='h-fit'>
                    {
                        leaveApplicants && leaveApplicants.map((item, index) => (
                            <tr className='text-center transition-300 hover:bg-zinc-100 cursor-pointer' key={index} onClick={() => {
                                modalHandler('applicant')
                                responseLeaveRequest('init', { id: item.id, name: 'test', category: item.leave_category, reason: item.reason, leave_at: item.leave_at, back_at: item.back_at, status: item.status, admin_msg: item.message_callback ? item.message_callback : '---' })
                            }}>
                                <td>{item.leave_category}</td>
                                <td>{item.reason}</td>
                                <td>{item.leave_at}</td>
                                <td>{item.back_at}</td>
                                <td>{item.status == null ? "---" : item.status ? "Approved" : "Rejected"}</td>
                                <td>{item.message_callback ? item.message_callback : '---'}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </section>
        <Modal>
            <div className='space-y-3'>
                {
                    modalType === 'applicant' && <>
                        <Label htmlFor='name' >Name</Label>
                        <Input type='text' name='name' disabled value={leaveApplicantModal.name} />
                        <Label htmlFor='category' >Category</Label>
                        <Input type='text' name='reason' disabled value={leaveApplicantModal.category} />
                        <Label htmlFor='reason' >Reason</Label>
                        <TextareaAutosize value={leaveApplicantModal.reason} disabled className='resize-none block w-full p-1 cursor-not-allowed' />
                        <Label htmlFor='leave_at' >Leave At</Label>
                        <Input type='text' name='leave_at' disabled value={leaveApplicantModal.leave_at} />
                        <Label htmlFor='back_at' >Back At</Label>
                        <Input type='text' name='back_at' disabled value={leaveApplicantModal.back_at} />
                        <Label htmlFor='status' >Status</Label>
                        <DropdownContainer itemStyle='full' appereance={<div className="w-full h-full flex items-center px-5 cursor-pointer border py-1 ">{leaveApplicantModal.status ? 'Approved' : '---'}</div>}>
                            <DropdownItem onClickCallback={() => setLeaveApplicantModal(prev => ({ ...prev, status: true }))}>Approved</DropdownItem>
                            <DropdownItem onClickCallback={() => setLeaveApplicantModal(prev => ({ ...prev, status: false }))}>Rejected</DropdownItem>
                        </DropdownContainer>
                        <Label htmlFor='admin_msg' >Message From Admin</Label>
                        <Input type='text' name='admin_msg' value={leaveApplicantModal.admin_msg} onChange={(e) => setLeaveApplicantModal(prev => ({ ...prev, admin_msg: e.target.value }))} />
                        <ErrorText className='text-slate-500'>optional</ErrorText>
                    </>
                }
                {
                    modalType !== 'applicant' && <>
                        <Label htmlFor='leave_name' >
                            {modalType === 'edit' && 'Edit'} Leave Type
                        </Label>
                        <Input type='text' name='leave_name' placeholder='Leave name..' autoComplete='off' value={leaveState.state} onChange={(e) => setLeaveState(prev => ({ ...prev, state: e.target.value }))} />
                    </>
                }
                {
                    leaveState.error && <ErrorText className="self-start">{leaveState.error}</ErrorText>
                }
                <Button className='w-full' onClick={() => {
                    if (modalType === 'create') {
                        addLeaveType()
                    } else if (modalType === 'edit') {
                        editLeaveType()
                    } else {
                        responseLeaveRequest('update')
                    }
                }}>{modalType === 'create' ? 'Create' : modalType === 'edit' ? 'Edit' : 'Response'}</Button>
            </div>
        </Modal >
    </div >;
}

export default _attendanceClient;