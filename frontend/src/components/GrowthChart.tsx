import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { GrowthRecord } from 'shared/types';

// Chart.jsの必要なコンポーネントを登録
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface GrowthChartProps {
    data: GrowthRecord[];
}

const GrowthChart: React.FC<GrowthChartProps> = ({ data }) => {
    // データを日付でソート
    const sortedData = [...data].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const chartData = {
        labels: sortedData.map(record =>
            new Date(record.date).toLocaleDateString('ja-JP')
        ),
        datasets: [
            {
                label: '足のサイズ (cm)',
                data: sortedData.map(record => record.footSize),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: '足の成長記録',
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'サイズ (cm)'
                },
                min: Math.floor(Math.min(...sortedData.map(d => d.footSize)) - 0.5),
                max: Math.ceil(Math.max(...sortedData.map(d => d.footSize)) + 0.5)
            },
            x: {
                title: {
                    display: true,
                    text: '日付'
                }
            }
        }
    };

    return (
        <div className="w-full p-4 bg-white rounded shadow">
            <Line data={chartData} options={options} />
        </div>
    );
};

export default GrowthChart;