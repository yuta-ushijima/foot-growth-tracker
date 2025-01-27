import mongoose, { Schema, Document } from 'mongoose';
import { GrowthRecord } from '../types';

export interface GrowthRecordDocument extends GrowthRecord, Document {}

const GrowthRecordSchema = new Schema({
    childName: {
        type: String,
        required: true
    },
    footSize: {
        type: Number,
        required: true,
        min: [0, 'サイズは0以上である必要があります'],
        max: [50, 'サイズが大きすぎます']
    },
    date: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: String,
        required: true
    },
    familyId: {
        type: String,
        required: true,
        index: true  // 家族IDでの検索を最適化
    }
});

// インデックスの作成
GrowthRecordSchema.index({ familyId: 1, date: -1 });

export const GrowthRecordModel = mongoose.model<GrowthRecordDocument>('GrowthRecord', GrowthRecordSchema);