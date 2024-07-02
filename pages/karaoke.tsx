import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import { groupBy } from 'lodash';
import Layout from '../components/Layout';
import damScoresDataJson from '../lib/dam-scores.json';
import { sortBy } from '../lib/utils';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const Score: React.FC<{
    title: string;
    artistName: string;
    performKey: string;
    score: number;
}> = ({ title, artistName, performKey, score}) => (
    <li className='block'>
        <div>
            <span className='text-lg font-bold mr-2'>
                {title}
            </span>
            {performKey !== '0' &&
                <div className='inline-block mr-2 px-1  border border-solid border-neutral-600 rounded-lg'>
                    {performKey}
                </div>
            }
            <div className='inline-block'>
                <span className='pr-2'>
                    /
                </span>
                <span>{artistName}</span>
            </div>
        </div>
        <div className='text-xl font-black'>
            {score}
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
                            title={score.contentsName}
                            artistName={score.artistName}
                            performKey={score.lastPerformKey}
                            score={Number(score['#text']) / 1000}
                        />
                    )
                    }
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
