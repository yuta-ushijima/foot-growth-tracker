import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { GrowthRecord, GrowthUpdateResponse } from 'shared/types';
const GrowthChart = React.lazy(() => import('./GrowthChart'));

interface NewRecordInput {
    childName: string;
    footSize: string;
}

const socket = io('http://localhost:3001', {
    withCredentials: true,
    transports: ['websocket', 'polling']
});

const GrowthTracker = () => {
    const [records, setRecords] = useState<GrowthRecord[]>([]);
    const [newRecord, setNewRecord] = useState<NewRecordInput>({
        childName: '',
        footSize: '',
    });
    const [familyId] = useState('family123');

    useEffect(() => {
        socket.emit('joinFamily', familyId);
        socket.emit('getGrowthHistory', familyId);

        socket.on('growthHistory', (history: GrowthRecord[]) => {
            console.log('Received history:', history);
            setRecords(history);
        });

        socket.on('growthUpdate', ({ record }: GrowthUpdateResponse) => {
            console.log('Received update:', record);
            setRecords(prev => [record, ...prev]);
        });

        return () => {
            socket.off('growthHistory');
            socket.off('growthUpdate');
        };
    }, [familyId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        socket.emit('newGrowthRecord', {
            childName: newRecord.childName,
            footSize: Number(newRecord.footSize),
            familyId,
            userId: 'user123',
        });
        setNewRecord({ childName: '', footSize: '' });
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">足の成長記録</h2>

            <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex gap-4 mb-4">
                    <input
                        type="text"
                        value={newRecord.childName}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, childName: e.target.value }))}
                        placeholder="お子様のお名前"
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        value={newRecord.footSize}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, footSize: e.target.value }))}
                        placeholder="足のサイズ (cm)"
                        className="p-2 border rounded"
                        step="0.1"
                        min="0"
                        required
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        記録する
                    </button>
                </div>
            </form>

            {records.length > 0 && (
                <div className="space-y-6">
                    <div className="bg-white p-4 rounded shadow">
                        <React.Suspense fallback={<div>Loading chart...</div>}>
                            <GrowthChart data={records} />
                        </React.Suspense>
                    </div>

                    <div className="space-y-2">
                        {records.map((record) => (
                            <div
                                key={record._id}
                                className="p-3 border rounded shadow-sm hover:shadow-md transition-shadow"
                            >
                                <p className="font-bold">{record.childName}</p>
                                <p>サイズ: {record.footSize}cm</p>
                                <p className="text-gray-500 text-sm">
                                    {new Date(record.date).toLocaleDateString('ja-JP')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GrowthTracker;