// Declare module @/lib/maimai-data.json
declare module '@/lib/maimai-data.json' {
    const value: {
        expertRecords: {
            name: string;
            level: string;
            score: number;
            isStandard: boolean;
        }[];
        prefectures: string[];
    };
    export default value;
}
