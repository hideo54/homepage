import dayjs from 'dayjs';
import type React from 'react';
import {
    CartesianGrid,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import type { MonthlyVisitStat } from '../../data/schema/swarm';

const MonthlyVisitChart: React.FC<{
    data: MonthlyVisitStat[];
    dataKey: 'airports' | 'countries' | 'keikenchi' | 'senkyoku' | 'usStates';
    maxCount?: number;
    tickInterval?: number;
}> = ({
    data,
    dataKey,
    maxCount = Math.max(...data.map(stat => stat[dataKey])),
    tickInterval = 50,
}) => (
    <LineChart
        data={data}
        margin={{ bottom: 0, left: 8, right: 8, top: 8 }}
        responsive
        style={{ height: 240, width: '100%' }}
    >
        <CartesianGrid stroke='var(--color-base-300)' vertical={false} />
        <CartesianGrid
            horizontal={false}
            stroke='var(--color-base-300)'
            strokeDasharray='4 4'
            syncWithTicks
        />
        <XAxis
            axisLine={{ stroke: 'var(--color-base-300)' }}
            dataKey='month'
            minTickGap={16}
            tick={{ fill: 'currentColor' }}
            tickFormatter={(month: string) =>
                String(Number(month.slice(0, 4)) + 1)
            }
            tickLine={false}
            ticks={data
                .map(stat => stat.month)
                .filter(month => month.endsWith('-12'))}
        />
        <YAxis
            axisLine={false}
            domain={[0, maxCount]}
            tick={{ fill: 'currentColor' }}
            tickLine={false}
            ticks={Array.from(
                { length: Math.floor(maxCount / tickInterval) + 1 },
                (_, i) => i * tickInterval,
            )}
            width={32}
        />
        <Tooltip
            contentStyle={{
                backgroundColor: 'var(--color-base-100)',
                borderColor: 'var(--color-base-300)',
                borderRadius: 4,
                fontSize: '1.2em',
                textAlign: 'right',
            }}
            cursor={{ stroke: 'var(--color-base-300)' }}
            formatter={value => [value?.toLocaleString()]}
            itemStyle={{
                color: 'currentColor',
                fontSize: '2em',
                fontWeight: 'bold',
            }}
            labelFormatter={month =>
                dayjs(month as string)
                    .add(1, 'month')
                    .format('YYYY年M月')
            }
        />
        <Line
            activeDot={{ r: 4 }}
            dataKey={dataKey}
            dot={false}
            isAnimationActive={false}
            stroke='var(--color-primary)'
            strokeWidth={2}
            type='stepAfter'
        />
    </LineChart>
);

export default MonthlyVisitChart;
