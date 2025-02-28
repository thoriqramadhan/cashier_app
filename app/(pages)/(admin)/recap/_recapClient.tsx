'use client'
import { FC, useState } from 'react';
import { Chart as ChartJs, CategoryScale, LinearScale, PointElement, LineElement, Title as ChartJsTitle, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TransactionRecap } from '@/types/transaction';
import { DropdownContainer, DropdownItem } from '@/components/client/dropdown';

interface _recapClientProps {
    yearlyData: TransactionRecap[]
}

const _recapClient: FC<_recapClientProps> = ({ yearlyData }) => {
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

    const filteredYearlyData = yearlyData.map(data => {
        const [year, month] = data.month.split('-')
        return { ...data, month: labels[parseInt(month)] }
    })
    const newYearChartData = labels.map((item) => {
        const datas = filteredYearlyData.map(yearData => {
            if (item === yearData.month) {
                return {
                    month: item,
                    totalIncome: Number(yearData.total_income)
                }
            }
            return {
                month: item,
                totalIncome: 0
            }
        })
        return datas[0]
    })
    const chartData = {
        labels,
        datasets: [
            {
                label: chartDataBy,
                data: newYearChartData.map(chartData => chartData.totalIncome),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ]
    }

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