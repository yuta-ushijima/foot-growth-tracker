import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import { GrowthRecordModel } from './models/GrowthRecord';
import { NewGrowthRecordData, GrowthUpdateResponse } from '../../shared/types';

class FootGrowthServer {
    private readonly app: express.Application;
    private readonly httpServer: ReturnType<typeof createServer>;
    private readonly io: Server;

    constructor() {
        this.app = express();
        this.httpServer = createServer(this.app);

        this.io = new Server(this.httpServer, {
            cors: {
                origin: ["http://localhost:30000", "http://127.0.0.1:30000"],
                methods: ["GET", "POST"],
                credentials: true
            }
        });

        this.initializeDatabase();
        this.initializeSocketHandlers();
    }

    private async initializeDatabase(): Promise<void> {
        try {
            await mongoose.connect('mongodb://localhost:27017/footgrowth');
            console.log('MongoDB接続成功');
        } catch (error) {
            console.error('MongoDB接続エラー:', error);
            process.exit(1);
        }
    }

    private initializeSocketHandlers(): void {
        this.io.on('connection', (socket: Socket) => {
            console.log('クライアント接続:', socket.id);

            socket.on('joinFamily', this.handleJoinFamily(socket));
            socket.on('newGrowthRecord', this.handleNewGrowthRecord(socket));
            socket.on('getGrowthHistory', this.handleGetGrowthHistory(socket));
            socket.on('disconnect', () => this.handleDisconnect(socket));
        });
    }

    private handleJoinFamily(socket: Socket) {
        return (familyId: string) => {
            socket.join(familyId);
            console.log(`Family ${familyId} に参加: ${socket.id}`);
        };
    }

    private handleNewGrowthRecord(socket: Socket) {
        return async (data: NewGrowthRecordData) => {
            try {
                const newRecord = new GrowthRecordModel({
                    childName: data.childName,
                    footSize: Number(data.footSize),
                    familyId: data.familyId,
                    userId: data.userId,
                    date: new Date()
                });

                const savedRecord = await newRecord.save();

                // savedRecordを安全なオブジェクトに変換
                const safeRecord = {
                    _id: savedRecord._id.toString(),
                    childName: savedRecord.childName,
                    footSize: Number(savedRecord.footSize),
                    date: savedRecord.date.toISOString(),
                    userId: savedRecord.userId,
                    familyId: savedRecord.familyId
                };

                const response: GrowthUpdateResponse = {
                    record: safeRecord,
                    message: `${data.childName}の新しい記録が追加されました！`
                };

                console.log('送信するレコード:', safeRecord);
                this.io.to(data.familyId).emit('growthUpdate', response);
            } catch (error) {
                console.error('記録保存エラー:', error);
                socket.emit('error', {
                    message: '記録の保存に失敗しました',
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        };
    }

    private handleGetGrowthHistory(socket: Socket) {
        return async (familyId: string) => {
            try {
                const records = await GrowthRecordModel.find({ familyId })
                    .sort({ date: -1 })
                    .limit(10)
                    .lean()
                    .exec();

                const safeRecords = records.map(record => ({
                    _id: record._id.toString(),
                    childName: record.childName,
                    footSize: Number(record.footSize),
                    date: new Date(record.date).toISOString(),
                    userId: record.userId,
                    familyId: record.familyId
                }));

                console.log('送信する履歴:', safeRecords);
                socket.emit('growthHistory', safeRecords);
            } catch (error) {
                console.error('履歴取得エラー:', error);
                socket.emit('error', {
                    message: '履歴の取得に失敗しました',
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        };
    }

    private handleDisconnect(socket: Socket) {
        console.log('クライアント切断:', socket.id);
    }

    public start(port: number = 3001): void {
        this.httpServer.listen(port, () => {
            console.log(`サーバー起動: http://localhost:${port}`);
        });
    }
}

const server = new FootGrowthServer();
server.start();