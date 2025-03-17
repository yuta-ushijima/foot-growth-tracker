import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { GrowthRecord } from 'shared/types';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface Props {
    data: GrowthRecord[];
}

const GrowthChart = ({ data }: Props) => {
    const sortedData = useMemo(() => {
        return [...data].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }, [data]);

    const chartData: ChartData<'line'> = {
        labels: sortedData.map(d => new Date(d.date).toLocaleDateString('ja-JP')),
        datasets: [{
            label: '足のサイズ',
            data: sortedData.map(d => d.footSize),
            borderColor: '#FF97B7',  // メインピンク
            backgroundColor: 'rgba(255, 151, 183, 0.2)',
            borderWidth: 4,
            pointRadius: 8,
            pointBackgroundColor: '#FF97B7',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            tension: 0.4,
            fill: true
        }]
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#FF97B7',
                bodyColor: '#4A5568',
                bodyFont: {
                    size: 14,
                    family: 'M PLUS Rounded 1c'
                },
                padding: 12,
                borderColor: '#FF97B7',
                borderWidth: 1,
                displayColors: false,
                callbacks: {
                    label: (context) => `${context.parsed.y} センチメートル`
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 151, 183, 0.1)'
                },
                ticks: {
                    font: {
                        family: 'M PLUS Rounded 1c',
                        size: 12
                    }
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 151, 183, 0.1)'
                },
                ticks: {
                    font: {
                        family: 'M PLUS Rounded 1c',
                        size: 12
                    },
                    callback: (value) => `${value} cm`
                }
            }
        }
    };

    return (
        <div style={{ width: '100%', height: '400px' }}>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default GrowthChart;