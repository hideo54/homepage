import clsx from 'clsx';
import dayjs from 'dayjs';
import { IoMusicalNote } from 'react-icons/io5';
import damScoresDataJson from '../../data/generated/dam-scores.json';
import {
    type DamData,
    type DamHighScore,
    type DamPlay,
    damScoreFailureThreshold,
} from '../../data/schema/dam';
import TrendChart from '../components/karaoke/TrendChart';
import Layout from '../components/Layout';
import { monthlyTrendOf, scoringDateOf, totalScoreOf } from '../lib/dam';

const damData = damScoresDataJson as unknown as DamData;

const movingAverageMonths = 3;

// 線が近くを通る項目どうしが見分けやすい色になるよう割り当てている。凡例に合わせて点数のだいたい高い順。
const skills = [
    ['radarChartRhythm', 'リズム', 'var(--color-chart-blue)'],
    [
        'radarChartVibratoLongtone',
        'ビブラート&ロングトーン',
        'var(--color-chart-orange)',
    ],
    ['radarChartPitch', '音程', 'var(--color-chart-aqua)'],
    ['radarChartStability', '安定性', 'var(--color-chart-violet)'],
    ['radarChartExpressive', '表現力', 'var(--color-chart-pink)'],
] as const satisfies [keyof DamPlay, string, string][];

const midiNoteToPitch = (note: number) => {
    const noteNames = [
        'C',
        'C#',
        'D',
        'D#',
        'E',
        'F',
        'F#',
        'G',
        'G#',
        'A',
        'A#',
        'B',
    ];
    const octave = Math.floor(note / 12) - 1;
    const noteName = noteNames[note % 12];
    return noteName + octave;
};

const ScoreWithAverage: React.FC<{
    myScore: number;
    averageScore: number;
    label?: string;
}> = ({ myScore, averageScore, label }) => (
    <div>
        <div className='-mb-1 font-bold text-sm'>{label}</div>
        <span
            className={clsx([
                'mr-2 font-bold',
                label ? 'text-xl' : 'text-2xl',
                myScore >= 90 && 'text-success',
            ])}
        >
            {myScore.toFixed(label ? 0 : 3)}
        </span>
        <span>
            平均 {myScore >= averageScore && '+'}
            {(myScore - averageScore).toFixed(label ? 0 : 3)}
        </span>
    </div>
);

const Score: React.FC<{
    scoreData: DamHighScore;
}> = ({ scoreData }) => (
    <li className='row-span-2 mb-4 grid grid-rows-subgrid'>
        <div className='flex'>
            <div>
                <IoMusicalNote className='mt-1 -ml-4' size={48} />
            </div>
            <div>
                <span className='mr-2 font-bold text-lg'>
                    {scoreData.contentsName}
                </span>
                {scoreData.lastPerformKey !== '0' && (
                    <div className='kbd kbd-sm mr-2'>
                        {Number(scoreData.lastPerformKey) > 0
                            ? Number(scoreData.lastPerformKey) - 12 // 音上げてたらそれは女声の上げの1オク下げだと思っていい
                            : scoreData.lastPerformKey}
                    </div>
                )}
                <div className='inline-block'>
                    <span className='pr-2'>/</span>
                    <span>{scoreData.artistName}</span>
                </div>
                <ScoreWithAverage
                    averageScore={
                        Number(scoreData.nationalAverageTotalPoints) / 1000
                    }
                    myScore={Number(scoreData['#text']) / 1000}
                />
            </div>
        </div>
        <div className='border-base-200 border-l-2 border-solid pl-3'>
            <div>{dayjs(scoreData.scoringDateTime).format('YYYY/MM/DD')}</div>
            <div>
                <div className='font-bold text-sm'>音域</div>
                <span className='mr-2'>
                    <span
                        className={clsx([
                            scoreData.vocalRangeLowest ===
                                scoreData.singingRangeLowest && 'text-success',
                        ])}
                    >
                        {midiNoteToPitch(
                            Number(scoreData.vocalRangeLowest) -
                                (Number(scoreData.lastPerformKey) > 0 ? 12 : 0),
                        )}
                    </span>
                    {' - '}
                    <span
                        className={clsx([
                            scoreData.vocalRangeHighest ===
                                scoreData.singingRangeHighest && 'text-success',
                        ])}
                    >
                        {midiNoteToPitch(
                            Number(scoreData.vocalRangeHighest) -
                                (Number(scoreData.lastPerformKey) > 0 ? 12 : 0),
                        )}
                    </span>
                </span>
                <span className='text-xs'>
                    {'['}
                    <span>
                        {midiNoteToPitch(Number(scoreData.singingRangeLowest))}
                    </span>
                    {' - '}
                    <span>
                        {midiNoteToPitch(Number(scoreData.singingRangeHighest))}
                    </span>
                    {']'}
                </span>
            </div>
            <ScoreWithAverage
                averageScore={Number(scoreData.nationalAveragePitch)}
                label='音程'
                myScore={Number(scoreData.radarChartPitch)}
            />
            <ScoreWithAverage
                averageScore={Number(
                    scoreData.nationalAverageVibratoAndLongtone,
                )}
                label='ビブラート&ロングトーン'
                myScore={Number(scoreData.radarChartVibratoLongtone)}
            />
            <ScoreWithAverage
                averageScore={Number(scoreData.nationalAverageRhythm)}
                label='リズム'
                myScore={Number(scoreData.radarChartRhythm)}
            />
            <ScoreWithAverage
                averageScore={Number(scoreData.nationalAverageExpression)}
                label='表現力'
                myScore={Number(scoreData.radarChartExpressive)}
            />
            <ScoreWithAverage
                averageScore={Number(scoreData.nationalAverageStability)}
                label='安定性'
                myScore={Number(scoreData.radarChartStability)}
            />
        </div>
    </li>
);

const App = () => {
    const plays = damData.plays
        .map(score => ({ score, time: scoringDateOf(score).getTime() }))
        .sort((a, b) => a.time - b.time);

    const totalPoints = plays.map(({ score, time }) => ({
        time,
        value: totalScoreOf(score),
    }));
    const totalTrend = monthlyTrendOf(totalPoints, movingAverageMonths);
    const skillLines = skills.map(([field, label, color]) => ({
        color,
        name: label,
        values: monthlyTrendOf(
            plays.map(({ score, time }) => ({
                time,
                value: Number(score[field]),
            })),
            movingAverageMonths,
        ),
    }));
    const skillValues = skillLines.flatMap(({ values }) =>
        values.map(({ value }) => value),
    );
    const skillTickStep =
        Math.max(...skillValues) - Math.min(...skillValues) > 40 ? 10 : 5;

    const times = [...totalPoints, ...totalTrend].map(({ time }) => time);
    const timeDomain: [number, number] = [
        Math.min(...times),
        Math.max(...times),
    ];
    const totalMax = Math.ceil(
        Math.max(
            damScoreFailureThreshold + 1,
            ...totalPoints.map(({ value }) => value),
        ),
    );

    return (
        <Layout title='カラオケ得点状況 | hideo54.com'>
            <h1 className='typography-h1'>カラオケ得点状況</h1>
            {plays.length > 0 && (
                <>
                    <section>
                        <h2 className='typography-h2'>得点の推移</h2>
                        <TrendChart
                            height={320}
                            lines={[
                                {
                                    color: 'var(--color-primary)',
                                    name: '得点',
                                    values: totalTrend,
                                },
                            ]}
                            points={totalPoints}
                            timeDomain={timeDomain}
                            yMax={totalMax}
                            yMin={damScoreFailureThreshold}
                            yTickStep={1}
                        />
                        <small>
                            月ごとの第3四分位数の{movingAverageMonths}
                            か月移動平均。
                        </small>
                    </section>
                    <section>
                        <h2 className='typography-h2'>採点要素ごとの推移</h2>
                        <ul className='m-0 flex flex-wrap gap-x-4 p-0 text-sm'>
                            {skillLines.map(({ color, name }) => (
                                <li
                                    className='flex items-center gap-x-1'
                                    key={name}
                                >
                                    <span
                                        className='inline-block h-0.5 w-4'
                                        style={{ backgroundColor: color }}
                                    />
                                    {name}
                                </li>
                            ))}
                        </ul>
                        <TrendChart
                            height={320}
                            lines={skillLines}
                            timeDomain={timeDomain}
                            yMax={Math.min(
                                100,
                                Math.ceil(
                                    Math.max(...skillValues) / skillTickStep,
                                ) * skillTickStep,
                            )}
                            yMin={
                                Math.floor(
                                    Math.min(...skillValues) / skillTickStep,
                                ) * skillTickStep
                            }
                            yTickStep={skillTickStep}
                        />
                        <small>
                            月ごとの第3四分位数の{movingAverageMonths}
                            か月移動平均。
                        </small>
                    </section>
                </>
            )}
            <section>
                <h2 className='typography-h2'>高かった得点</h2>
                <ul className='grid auto-rows-min grid-cols-1 gap-x-4 p-0 md:grid-cols-2 lg:grid-cols-3'>
                    {damData.highScores.map(score => (
                        <Score key={score.scoringDateTime} scoreData={score} />
                    ))}
                </ul>
            </section>
        </Layout>
    );
};

export default App;
