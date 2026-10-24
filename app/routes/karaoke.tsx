import clsx from 'clsx';
import dayjs from 'dayjs';
import { IoMusicalNote } from 'react-icons/io5';
import damScoresDataJson from '../../data/generated/dam-scores.json';
import {
    type DamScoreSummary,
    damScoreFailureThreshold,
} from '../../data/schema/dam';
import ScoreCeilingChart from '../components/karaoke/ScoreCeilingChart';
import Layout from '../components/Layout';
import { sortBy } from '../lib/utils';

const damScoresData = damScoresDataJson as unknown as DamScoreSummary[];

const displayScoreThreshold = 88;
const movingAverageMonths = 3;

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
    scoreData: DamScoreSummary;
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
    const applicableScores = damScoresData.filter(
        score =>
            // 途中で歌うのをやめたものは除外
            Number(score.aiSensitivityGraphAddPointsSection24) > 0 ||
            Number(score.aiSensitivityGraphDeductPointsSection24) > 0,
    );
    return (
        <Layout title='カラオケ得点状況 | hideo54.com'>
            <h1 className='typography-h1'>カラオケ得点状況</h1>
            <section>
                <h2 className='typography-h2'>得点の推移</h2>
                <ScoreCeilingChart
                    minScore={damScoreFailureThreshold}
                    movingAverageMonths={movingAverageMonths}
                    scores={applicableScores}
                />
                <small>
                    月ごとの第3四分位数の{movingAverageMonths}か月移動平均
                </small>
            </section>
            <section>
                <h2 className='typography-h2'>高かった得点</h2>
                <ul className='grid auto-rows-min grid-cols-1 gap-x-4 p-0 md:grid-cols-2 lg:grid-cols-3'>
                    {sortBy(damScoresData, score => -Number(score['#text']))
                        .filter(
                            score =>
                                Number(score['#text']) / 1000 >=
                                displayScoreThreshold,
                        )
                        .map(score => (
                            <Score
                                key={score.scoringDateTime}
                                scoreData={score}
                            />
                        ))}
                </ul>
            </section>
        </Layout>
    );
};

export default App;
