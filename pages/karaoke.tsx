import { MusicalNote } from '@styled-icons/ionicons-solid';
import chroma from 'chroma-js';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { type Dictionary, groupBy } from 'lodash';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import damScoresDataJson from '../lib/dam-scores.json';
import { sortBy } from '../lib/utils';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

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
                'mr-2',
                label ? 'font-bold text-xl' : 'font-black text-2xl',
                myScore >= 90 && 'text-green-700',
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
    scoreData: (typeof damScoresDataJson)[0];
}> = ({ scoreData }) => (
    <li className='mr-2 mb-8 inline-block p-0'>
        <div className='flex'>
            <div>
                <MusicalNote className='mt-1' size={48} />
            </div>
            <div>
                <span className='mr-2 font-bold text-lg'>
                    {scoreData.contentsName}
                </span>
                {scoreData.lastPerformKey !== '0' && (
                    <div className='mr-2 inline-block rounded-lg border border-neutral-600 border-solid px-1'>
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
        <div className='ml-5 border-neutral-400 border-l-2 border-solid pl-3'>
            <div>{dayjs(scoreData.scoringDateTime).format('YYYY/M/D')}</div>
            <div>
                <div className='font-bold text-sm'>音域</div>
                <span className='mr-2'>
                    <span
                        className={clsx([
                            scoreData.vocalRangeLowest ===
                                scoreData.singingRangeLowest &&
                                'text-green-700',
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
                                scoreData.singingRangeHighest &&
                                'text-green-700',
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

const BoxPlotByDate: React.FC<{
    scoreDataByDate: Dictionary<typeof damScoresDataJson>;
}> = ({ scoreDataByDate }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        if (!window) return;
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            if (!isDarkMode) {
                setIsDarkMode(true);
            }
        }
        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', e => {
                setIsDarkMode(e.matches);
            });
    }, []);
    const jetScale = chroma
        .scale([
            // Jet style gradation by ChatGPT
            '#00007F',
            '#0000BF',
            '#007FBF',
            '#00BFBF',
            '#7FBF7F',
            '#BFBF00',
            '#BF7F00',
            '#BF0000',
            '#7F0000',
        ])
        .domain([75, 95]);
    return (
        <Plot
            config={{
                staticPlot: true,
            }}
            data={Object.entries(scoreDataByDate).map(([date, scores]) => ({
                marker: {
                    // その日の平均点を jet で色付け
                    color: jetScale(
                        Math.round(
                            scores
                                .map(score => Number(score['#text']) / 1000)
                                .reduce((acc, cur) => acc + cur, 0) /
                                scores.length,
                        ),
                    ).hex(),
                },
                name: dayjs(date, 'YYYYMMDD').format('YYYY-MM-DD'),
                type: 'box',
                y: scores?.map(score => Number(score['#text']) / 1000),
            }))}
            layout={{
                autosize: true,
                font: {
                    color: isDarkMode ? '#ffffff' : '#171717', // neutral-900
                },
                margin: {
                    b: 60,
                    l: 20,
                    r: 0,
                    t: 0,
                },
                paper_bgcolor: isDarkMode ? '#000000' : '#ffffff',
                plot_bgcolor: isDarkMode ? '#000000' : '#ffffff',
                showlegend: false,
                xaxis: {
                    tickformat: '%Y-%m-%d',
                    // type: 'category', // 等間隔にしたい場合はこれ
                },
                yaxis: {
                    gridcolor: isDarkMode ? '#404040' : '#d4d4d4', // neutral-700, neutral-400
                },
            }}
            style={{
                width: '100%',
            }}
            useResizeHandler
        />
    );
};

const App = () => {
    const applicableScores = damScoresDataJson.filter(
        score =>
            // 途中で歌うのをやめたものは除外
            Number(score.aiSensitivityGraphAddPointsSection24) > 0 ||
            Number(score.aiSensitivityGraphDeductPointsSection24) > 0,
    );
    const scoreDataByDate = groupBy(applicableScores, score =>
        score.scoringDateTime.slice(0, 8),
    );
    return (
        <Layout title='カラオケ得点状況 | hideo54.com'>
            <h1>カラオケ得点状況</h1>
            <section>
                <ul className='p-0'>
                    {sortBy(damScoresDataJson, score => -Number(score['#text']))
                        .filter(score => Number(score['#text']) / 1000 >= 87.5)
                        .map(score => (
                            <Score
                                key={score.scoringDateTime}
                                scoreData={score}
                            />
                        ))}
                </ul>
            </section>
            <section>
                <h2>日ごとの得点推移</h2>
                <div className='mb-8 h-[450px]'>
                    <BoxPlotByDate scoreDataByDate={scoreDataByDate} />
                </div>
            </section>
        </Layout>
    );
};

export default App;
