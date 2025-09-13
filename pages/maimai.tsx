import Layout from '../components/Layout';
import Map from '../components/Map';
import maimaiDataJson from '../lib/maimai-data.json';

const App = () => {
    return (
        <Layout
            description='ほとんどのゲームが苦手なhideo54がまあ嫌いなわけでもない音楽ゲーム「maimaiでらっくす」のプレイ情報です。'
            title='maimai でらっくす プレイ状況 | hideo54.com'
        >
            <h1>maimai でらっくす</h1>
            <p>
                ほとんどのゲームが苦手なhideo54がまあ嫌いなわけでもない音楽ゲーム「maimaiでらっくす」のプレイ状況です。
            </p>
            <section>
                <h2>スコア 100% 超えの Expert 楽曲</h2>
                <ul>
                    {maimaiDataJson.expertRecords
                        .filter(record => record.score > 1.0)
                        .map(record => (
                            <li className='not-prose' key={record.name}>
                                <div>
                                    <span className='font-black text-lg'>
                                        {record.name.normalize('NFKC')}
                                    </span>
                                    {!record.isStandard && (
                                        <img
                                            alt='Delux'
                                            className='mb-2 ml-2 inline h-4'
                                            src='https://maimaidx.jp/maimai-mobile/img/music_dx.png'
                                        />
                                    )}
                                </div>
                                <div>
                                    <span className='mr-4'>
                                        Lv. {record.level}
                                    </span>
                                    <span>
                                        <span className='mr-1 font-bold text-xl'>
                                            {(record.score * 100).toFixed(4)}
                                        </span>
                                        %
                                    </span>
                                </div>
                            </li>
                        ))}
                </ul>
            </section>
            <section>
                <h2>全国行脚 (プレイしたことがある都道府県)</h2>
                <Map
                    count={maimaiDataJson.prefectures.length}
                    fill={Object.fromEntries(
                        maimaiDataJson.prefectures.map(prefId => [
                            prefId,
                            '#e89402',
                        ]),
                    )}
                    id='maimai'
                    maxCount={47}
                    path='/prefectures-simplify-20.svg'
                    viewBox='137.0 20.0 591.0 740.0'
                />
            </section>
        </Layout>
    );
};

export default App;
