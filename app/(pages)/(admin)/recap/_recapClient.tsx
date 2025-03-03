'use client'
import { FC, useEffect, useState } from 'react';
import { Chart as ChartJs, CategoryScale, LinearScale, PointElement, LineElement, Title as ChartJsTitle, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TransactionRecap } from '@/types/transaction';
import { DropdownContainer, DropdownItem } from '@/components/client/dropdown';
import { number } from 'zod';

interface _recapClientProps {
}

const _recapClient: FC<_recapClientProps> = ({ }) => {
    const chartDataType = ['Year', 'Month', 'Date']
    const months = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        name: new Date(0, i).toLocaleString("en-US", { month: "long" }),
    }));
    const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i)
    const getDaysInMonth = (year: number, month: number) => {
        if (!year || !month) return [];
        const days = new Date(year, month, 0).getDate()
        return Array.from({ length: days }, (_, i) => i + 1)
    }

    const [chartDataBy, setChartDataBy] = useState(chartDataType[0])
    const [dateToFilter, setDateToFilter] = useState({
        year: new Date().getFullYear(),
        month: new Date().toLocaleString('en-US', { month: 'long' }),
        date: new Date().getDate()
    })
    type chartValueType = {
        totalIncome: number
    }
    const [chartValue, setChartValue] = useState<chartValueType[]>([])

    // mendaftarkan utils yang mau dipakai di charJS
    ChartJs.register(CategoryScale, LinearScale, PointElement, LineElement, ChartJsTitle, Tooltip, Legend)
    const labels = months.map(item => item.name)
    const chartOption = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        }
    }
    const labelBy = chartDataBy === 'Year' ? labels : chartDataBy === 'Month' ? getDaysInMonth(dateToFilter.year, 2) : [0, 1, 2]
    const chartData = {
        labels: labelBy,
        datasets: [
            {
                label: chartDataBy,
                data: chartValue.length > 0 ? chartValue.map(chartData => chartData.total_income) : [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ]
    }
    console.log(dateToFilter);

    useEffect(() => {
        const getByMonth = async () => {
            try {
                const response = await fetch(`/api/recap/month?year=${dateToFilter.year}&month=${labels.indexOf(dateToFilter.month) + 1}`, {
                    method: 'GET'
                })
                if (!response.ok) throw new Error(`Failed to fetch recap : ${response.statusText}`)
                const responseData = await response.json()
                const filteredResponse = responseData.map(item => ({ ...item, transaction_date: new Date(item.transaction_date).getDate() }))
                const totalDates = getDaysInMonth(dateToFilter.year, 2)
                const newChartValue = totalDates.map(item => {
                    const transaction = filteredResponse.find(response => response.transaction_date === item)
                    return {
                        item,
                        total_income: transaction ? Number(transaction?.total_income) : 0
                    }
                })

                setChartValue(newChartValue)
            } catch (error) {
                console.log(error);

            }
        }
        const getByYear = async () => {
            try {
                const response = await fetch(`/api/recap/year?year=${dateToFilter.year}`, {
                    method: 'GET'
                })
                if (!response.ok) throw new Error(`Failed to fetch recap : ${response.statusText}`)
                const responseData = await response.json()
                const filteredYearlyData = responseData.map(data => {
                    const [year, month] = data.month.split('-')
                    return { ...data, month: labels[parseInt(month)] }
                })
                const newChartValue = labels.map(month => {
                    const isValid = filteredYearlyData.find(item => item.month === month)
                    return {
                        total_income: isValid ? Number(isValid.total_income) : 0
                    }
                })
                setChartValue(newChartValue)
            } catch (error) {
                console.log(error);
            }
        }
        if (chartDataBy === 'Month') {
            getByMonth()
        } else if (chartDataBy === 'Year') {
            getByYear()
        }
    }, [dateToFilter, chartDataBy])
    useEffect(() => {
        console.log(chartValue, chartData);

    }, [chartValue])

    // memakai react-chart diatas ChartJs
    return <>
        <div className="w-full flex justify-between">
            <div className="">
                {/* filter type */}
                <DropdownContainer appereance={<div className="w-full h-full flex items-center px-5 cursor-pointer border py-1 rounded-sm">{chartDataBy}</div>}>
                    {
                        chartDataType.map((item, index) => (<DropdownItem key={index} onClickCallback={() => setChartDataBy(item)}>{item}</DropdownItem>))
                    }
                </DropdownContainer>
            </div>

            <div className="flex space-x-2">
                {/* year */}
                <DropdownContainer appereance={<div className="w-full h-full flex items-center px-5 cursor-pointer border py-1 rounded-sm">{dateToFilter.year}</div>}>
                    {
                        years.map((item, index) => (<DropdownItem key={index} onClickCallback={() => setDateToFilter(prev => ({ ...prev, year: item }))}>{item}</DropdownItem>))
                    }
                </DropdownContainer>
                {/* month */}
                <DropdownContainer appereance={<div className="w-full h-full flex items-center px-5 cursor-pointer border py-1 rounded-sm">{dateToFilter.month}</div>}>
                    {
                        months.map((item, index) => (<DropdownItem key={index} onClickCallback={() => setDateToFilter(prev => ({
                            ...prev, month: item.name
                        }))}>{item.name}</DropdownItem>))
                    }
                </DropdownContainer>
                {/* date */}
                <DropdownContainer appereance={<div className="w-full h-full flex items-center px-5 cursor-pointer border py-1 rounded-sm">{dateToFilter.date}</div>}>
                    {
                        getDaysInMonth(dateToFilter.year, 2).map((item, index) => (<DropdownItem key={index} onClickCallback={() => setDateToFilter(prev => ({ ...prev, date: item }))}>{item}</DropdownItem>))
                    }
                </DropdownContainer>
            </div>

        </div>
        <Line data={chartData} options={chartOption} />
    </>
}

export default _recapClient;