import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import { groupBy } from 'lodash';
import clsx from 'clsx';
import { MusicalNote } from '@styled-icons/ionicons-solid'
import Layout from '../components/Layout';
import damScoresDataJson from '../lib/dam-scores.json';
import { sortBy } from '../lib/utils';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const ScoreWithAverage: React.FC<{
    myScore: number;
    averageScore: number;
    label?: string;
}> = ({ myScore, averageScore, label }) => (
    <div>
        <div className='text-sm font-bold -mb-1'>
            {label}
        </div>
        <span className={clsx([
            'mr-2',
            label ? 'text-xl font-bold' : 'text-2xl font-black',
        ])}>
            {myScore.toFixed(label ? 0 : 3 )}
        </span>
        <span>
            平均 {myScore >= averageScore && '+'}{(myScore - averageScore).toFixed(label ? 0 : 3)}
        </span>
    </div>
);

const Score: React.FC<{
    scoreData: typeof damScoresDataJson[0];
}> = ({ scoreData }) => (
    <li className='inline-block mr-2 mb-8 p-0'>
        <div className='flex'>
            <div>
                <MusicalNote size={48} className='mt-1' />
            </div>
            <div>
                <span className='text-lg font-bold mr-2'>
                    {scoreData.contentsName}
                </span>
                {scoreData.lastPerformKey !== '0' &&
                    <div className='inline-block mr-2 px-1 border border-solid border-neutral-600 rounded-lg'>
                        {scoreData.lastPerformKey}
                    </div>
                }
                <div className='inline-block'>
                    <span className='pr-2'>
                        /
                    </span>
                    <span>{scoreData.artistName}</span>
                </div>
                <ScoreWithAverage
                    myScore={Number(scoreData['#text']) / 1000}
                    averageScore={Number(scoreData.nationalAverageTotalPoints) / 1000}
                />
            </div>
        </div>
        <div className='ml-5 pl-3 border-l-2 border-solid border-neutral-400'>
            <ScoreWithAverage
                myScore={Number(scoreData.radarChartPitch)}
                averageScore={Number(scoreData.nationalAveragePitch)}
                label='音程'
            />
            <ScoreWithAverage
                myScore={Number(scoreData.radarChartVibratoLongtone)}
                averageScore={Number(scoreData.nationalAverageVibratoAndLongtone)}
                label='ビブラート&ロングトーン'
            />
            <ScoreWithAverage
                myScore={Number(scoreData.radarChartRhythm)}
                averageScore={Number(scoreData.nationalAverageRhythm)}
                label='リズム'
            />
            <ScoreWithAverage
                myScore={Number(scoreData.radarChartExpressive)}
                averageScore={Number(scoreData.nationalAverageExpression)}
                label='表現力'
            />
            <ScoreWithAverage
                myScore={Number(scoreData.radarChartStability)}
                averageScore={Number(scoreData.nationalAverageStability)}
                label='安定性'
            />
        </div>
    </li>
);

const App = () => {
    const scoreDataByDate = groupBy(damScoresDataJson, score => score.scoringDateTime.slice(0, 8));
    return (
        <Layout
            title='カラオケ得点状況 | hideo54.com'
        >
            <h1>カラオケ得点状況</h1>
            <section>
                <ul className='p-0'>
                    {sortBy(damScoresDataJson, score => - Number(score['#text'])).filter(score  =>
                        Number(score['#text']) / 1000 >= 87.5
                    ).map(score =>
                        <Score
                            key={score.scoringDateTime}
                            scoreData={score}
                        />
                    )}
                </ul>
            </section>
            <section>
                <h2>
                    日ごとの得点推移
                </h2>
                <Plot
                    data={
                        Object.entries(scoreDataByDate).map(([date, scores]) => ({
                            y: scores?.map(score => Number(score['#text']) / 1000),
                            type: 'box',
                            name: dayjs(date, 'YYYYMMDD').format('YYYY-MM-DD'),
                        }))
                    }
                    layout={{
                        autosize: true,
                        xaxis: {
                            tickformat: '%Y-%m-%d',
                        },
                    }}
                    config={{
                        staticPlot: true,
                    }}
                    onHover={() => {}} // tooltip を無効化
                    useResizeHandler
                    style={{
                        width: '100%',
                    }}
                />
            </section>
        </Layout>
    );
};

export default App;
