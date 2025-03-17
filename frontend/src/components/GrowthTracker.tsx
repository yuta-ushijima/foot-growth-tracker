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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 入力値の検証
        if (!newRecord.childName.trim() || !newRecord.footSize) {
            return;
        }

        // 新しい記録をサーバーに送信
        const recordData = {
            childName: newRecord.childName.trim(),
            footSize: Number(newRecord.footSize),
            familyId,
            userId: 'user123', // 実際の実装では認証システムから取得
        };

        try {
            socket.emit('newGrowthRecord', recordData);

            // フォームをリセット
            setNewRecord({
                childName: '',
                footSize: '',
            });
        } catch (error) {
            console.error('Error submitting record:', error);
            // エラー処理を追加する場合はここに実装
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50">
            <div className="max-w-5xl mx-auto p-6">
                {/* ヘッダー */}
                <header className="text-center mb-12 animate-float">
                    <h1 className="text-4xl font-bold text-pink-500 mb-3">
                        👣 すくすく足育記録
                    </h1>
                    <p className="text-blue-400 text-lg">
                        大切な思い出を、みんなで残そう♪
                    </p>
                </header>

                {/* 記録フォーム */}
                <section className="rounded-3xl shadow-lg bg-white p-8 md:p-10 mb-10">
                    <h2 className="text-2xl font-bold text-pink-500 mb-8 flex items-center">
                        <span className="mr-3 text-3xl">📏</span>
                        今日の記録をつけよう！
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto bg-pink-50 rounded-2xl p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* お名前入力フィールド */}
                            <div className="space-y-3">
                                <label
                                    className="block text-gray-600 text-lg font-medium pl-3"
                                    htmlFor="childName"
                                >
                                    お名前
                                </label>
                                <div className="relative">
                                    <input
                                        id="childName"
                                        type="text"
                                        value={newRecord.childName}
                                        onChange={(e) => setNewRecord(prev => ({ ...prev, childName: e.target.value }))}
                                        placeholder="例：はるちゃん"
                                        className="w-full px-6 py-4 text-lg border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all bg-white"
                                        required
                                    />
                                    <span className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl">
            👶
          </span>
                                </div>
                            </div>

                            {/* サイズ入力フィールド */}
                            <div className="space-y-3">
                                <label
                                    className="block text-gray-600 text-lg font-medium pl-3"
                                    htmlFor="footSize"
                                >
                                    足のサイズ
                                </label>
                                <div className="relative">
                                    <input
                                        id="footSize"
                                        type="number"
                                        value={newRecord.footSize}
                                        onChange={(e) => setNewRecord(prev => ({ ...prev, footSize: e.target.value }))}
                                        placeholder="15.5"
                                        className="w-full px-6 py-4 text-lg border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all bg-white"
                                        step="0.1"
                                        min="0"
                                        required
                                    />
                                    <span className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl">
            📏
          </span>
                                </div>
                                <span className="text-gray-500 text-base pl-3">
          センチメートル (cm)
        </span>
                            </div>
                        </div>

                        {/* 送信ボタン */}
                        <div className="text-center pt-4">
                            <button
                                type="submit"
                                className="px-12 py-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full text-lg font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                            >
                                記録する ✨
                            </button>
                        </div>
                    </form>
                </section>

                {records.length > 0 ? (
                    <div className="space-y-10">
                        {/* グラフ */}
                        <section className="rounded-bubble shadow-soft bg-white p-8">
                            <h2 className="text-2xl font-bold text-blue-500 mb-6 flex items-center">
                                <span className="mr-3 text-3xl">📈</span>
                                成長のようす
                            </h2>
                            <React.Suspense
                                fallback={
                                    <div className="h-80 flex items-center justify-center text-gray-500">
                                        グラフを準備しています...
                                    </div>
                                }
                            >
                                <GrowthChart data={records} />
                            </React.Suspense>
                        </section>

                        {/* 記録一覧 */}
                        <section className="rounded-bubble shadow-soft bg-white p-8">
                            <h2 className="text-2xl font-bold text-blue-500 mb-6 flex items-center">
                                <span className="mr-3 text-3xl">📝</span>
                                これまでの記録
                            </h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                {records.map((record) => (
                                    <div
                                        key={record._id}
                                        className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50 border-2 border-blue-100 hover:shadow-warm transition-all hover:-translate-y-1"
                                    >
                                        <div className="text-xl font-bold text-pink-500 mb-2">
                                            {record.childName}さん
                                        </div>
                                        <div className="text-3xl font-bold text-blue-500 mb-2">
                                            {record.footSize} cm
                                        </div>
                                        <div className="text-gray-500">
                                            {new Date(record.date).toLocaleDateString('ja-JP')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className="text-center py-16 text-gray-500 text-lg">
                        最初の記録をつけてみましょう！ 👟
                    </div>
                )}
            </div>
        </div>
    );
};

export default GrowthTracker;