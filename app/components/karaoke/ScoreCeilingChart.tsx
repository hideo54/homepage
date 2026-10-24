import dayjs from 'dayjs';
import type React from 'react';
import {
    CartesianGrid,
    ComposedChart,
    Line,
    Scatter,
    XAxis,
    YAxis,
} from 'recharts';
import type { DamScoreSummary } from '../../../data/schema/dam';
import { scoringDateOf, totalScoreOf } from '../../lib/dam';

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

const ScoreCeilingChart: React.FC<{
    minScore: number;
    movingAverageMonths: number;
    scores: DamScoreSummary[];
}> = ({ minScore, movingAverageMonths, scores }) => {
    if (scores.length === 0) return null;
    const plays = scores.map(score => ({
        score: totalScoreOf(score),
        time: scoringDateOf(score).getTime(),
    }));
    const monthlyQuartiles = Object.entries(
        Object.groupBy(plays, play => karaokeMonthOf(play.time)),
    ).map(([month, monthPlays = []]) => ({
        month,
        score: thirdQuartileOf(monthPlays.map(play => play.score)),
    }));
    // 行かなかった月は平均の対象に含めず、行った月にだけ点を打つ
    const months = monthlyQuartiles
        .map(({ month }) => {
            const windowStart = dayjs(month)
                .subtract(movingAverageMonths - 1, 'month')
                .format('YYYY-MM');
            const window = monthlyQuartiles.filter(
                other => windowStart <= other.month && other.month <= month,
            );
            return {
                month,
                score:
                    window.reduce((acc, cur) => acc + cur.score, 0) /
                    window.length,
                time: dayjs(`${month}-15`).valueOf(),
            };
        })
        .sort((a, b) => a.time - b.time);

    const visiblePlays = plays.filter(play => play.score > minScore);
    const maxScore = Math.ceil(
        Math.max(minScore + 1, ...visiblePlays.map(play => play.score)),
    );
    const scoreTicks = Array.from(
        { length: maxScore - minScore + 1 },
        (_, i) => minScore + i,
    );

    const times = [...plays, ...months].map(item => item.time);
    const timeDomain = [Math.min(...times), Math.max(...times)];
    const firstYear = new Date(Math.min(...times)).getFullYear();
    const lastYear = new Date(Math.max(...times)).getFullYear();
    const yearTicks = Array.from({ length: lastYear - firstYear }, (_, i) =>
        new Date(firstYear + i + 1, 0, 1).getTime(),
    );

    return (
        <ComposedChart
            data={months}
            margin={{ bottom: 0, left: 8, right: 8, top: 8 }}
            responsive
            style={{ height: 320, width: '100%' }}
        >
            <CartesianGrid
                stroke='var(--color-base-200)'
                syncWithTicks
                vertical={false}
            />
            <XAxis
                axisLine={{ stroke: 'var(--color-base-200)' }}
                dataKey='time'
                domain={timeDomain}
                scale='time'
                tick={{ fill: 'currentColor' }}
                tickFormatter={(time: number) =>
                    String(new Date(time).getFullYear())
                }
                tickLine={false}
                ticks={yearTicks}
                type='number'
            />
            <YAxis
                axisLine={false}
                dataKey='score'
                domain={[minScore, maxScore]}
                interval={0}
                tick={{ fill: 'currentColor' }}
                tickLine={false}
                ticks={scoreTicks}
                width={32}
            />
            <Scatter
                data={visiblePlays}
                isAnimationActive={false}
                shape={(props: { cx?: number; cy?: number }) => (
                    <circle
                        className='fill-base-300 opacity-50'
                        cx={props.cx}
                        cy={props.cy}
                        r={2}
                    />
                )}
            />
            <Line
                dataKey='score'
                dot={{ fill: 'var(--color-primary)', r: 3 }}
                isAnimationActive={false}
                stroke='var(--color-primary)'
                strokeWidth={2}
            />
        </ComposedChart>
    );
};

export default ScoreCeilingChart;
