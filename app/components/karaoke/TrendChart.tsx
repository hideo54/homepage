import type React from 'react';
import {
    CartesianGrid,
    ComposedChart,
    Line,
    Scatter,
    XAxis,
    YAxis,
} from 'recharts';
import type { TimedValue } from '../../lib/dam';

const TrendChart: React.FC<{
    height: number;
    lines: { color: string; name: string; values: TimedValue[] }[];
    points?: TimedValue[];
    timeDomain: [number, number];
    yMin: number;
    yMax: number;
    yTickStep: number;
}> = ({ height, lines, points, timeDomain, yMin, yMax, yTickStep }) => {
    const firstYear = new Date(timeDomain[0]).getFullYear();
    const lastYear = new Date(timeDomain[1]).getFullYear();
    const yearTicks = Array.from({ length: lastYear - firstYear }, (_, i) =>
        new Date(firstYear + i + 1, 0, 1).getTime(),
    );
    const valueTicks = Array.from(
        { length: Math.floor((yMax - yMin) / yTickStep) + 1 },
        (_, i) => yMin + i * yTickStep,
    );

    return (
        <ComposedChart
            margin={{ bottom: 0, left: 8, right: 8, top: 8 }}
            responsive
            style={{ height, width: '100%' }}
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
                dataKey='value'
                domain={[yMin, yMax]}
                interval={0}
                tick={{ fill: 'currentColor' }}
                tickLine={false}
                ticks={valueTicks}
                width={32}
            />
            {points && (
                <Scatter
                    data={points}
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
            )}
            {lines.map(({ color, name, values }) => (
                <Line
                    data={values}
                    dataKey='value'
                    dot={{ fill: color, r: 3 }}
                    isAnimationActive={false}
                    key={name}
                    name={name}
                    stroke={color}
                    strokeWidth={2}
                />
            ))}
        </ComposedChart>
    );
};

export default TrendChart;
