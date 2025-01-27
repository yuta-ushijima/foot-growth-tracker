interface GrowthRecord {
    _id?: string;
    childName: string;
    footSize: number;
    date: Date;
    userId: string;
    familyId: string;
}
export interface NewGrowthRecordData {
    childName: string;
    footSize: number;
    userId: string;
    familyId: string;
}

export interface GrowthUpdateResponse {
    record: GrowthRecord;
    message: string;
}

interface NewRecordInput {
    childName: string;
    footSize: string;
}