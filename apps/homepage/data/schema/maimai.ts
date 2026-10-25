export type PrefectureId = string;

export interface MaimaiExpertRecord {
    isStandard: boolean | undefined;
    level: string;
    name: string;
    score: number;
}

export interface MaimaiData {
    expertRecords: MaimaiExpertRecord[];
    prefectures: PrefectureId[];
}
