import dayjs from 'dayjs';
import type { DamScoreSummary } from '../../data/schema/dam';

export const totalScoreOf = (score: DamScoreSummary) =>
    Number(score['#text']) / 1000;

/** scoringDateTime は YYYYMMDDHHmmss */
export const scoringDateOf = (score: DamScoreSummary) => {
    const s = score.scoringDateTime;
    return new Date(
        Number(s.slice(0, 4)),
        Number(s.slice(4, 6)) - 1,
        Number(s.slice(6, 8)),
        Number(s.slice(8, 10)),
        Number(s.slice(10, 12)),
        Number(s.slice(12, 14)),
    );
};

export interface TimedValue {
    time: number;
    value: number;
}

// 線形補間（Excel の QUARTILE.INC と同じ）
const thirdQuartileOf = (values: number[]) => {
    const sorted = values.toSorted((a, b) => a - b);
    const position = (sorted.length - 1) * 0.75;
    const lower = Math.floor(position);
    const upper = Math.ceil(position);
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
};

// 月末の深夜まで歌った分もその月に数えるため、朝5時で日付を区切る
const karaokeMonthOf = (time: number) =>
    dayjs(time).subtract(5, 'hour').format('YYYY-MM');

/** 月ごとの第3四分位数の移動平均。行かなかった月は平均の対象に含めず、行った月にだけ値を出す。 */
export const monthlyTrendOf = (
    values: TimedValue[],
    movingAverageMonths: number,
): TimedValue[] => {
    const monthlyQuartiles = Object.entries(
        Object.groupBy(values, ({ time }) => karaokeMonthOf(time)),
    ).map(([month, monthValues = []]) => ({
        month,
        value: thirdQuartileOf(monthValues.map(({ value }) => value)),
    }));
    return monthlyQuartiles
        .map(({ month }) => {
            const windowStart = dayjs(month)
                .subtract(movingAverageMonths - 1, 'month')
                .format('YYYY-MM');
            const window = monthlyQuartiles.filter(
                other => windowStart <= other.month && other.month <= month,
            );
            return {
                time: dayjs(`${month}-15`).valueOf(),
                value:
                    window.reduce((acc, cur) => acc + cur.value, 0) /
                    window.length,
            };
        })
        .sort((a, b) => a.time - b.time);
};
