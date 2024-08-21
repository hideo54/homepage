import Layout from '../components/Layout';
import Map from '../components/Map';
import maimaiDataJson from '../lib/maimai-data.json';
import PrefecturesMapSvg from '../public/prefectures-simplify-20.svg';

const App = () => {
    return (
        <Layout
            title='maimai でらっくす プレイ状況 | hideo54.com'
            description='ほとんどのゲームが苦手なhideo54がまあ嫌いなわけでもない音楽ゲーム「maimaiでらっくす」のプレイ情報です。'
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
                            <li key={record.name} className='not-prose'>
                                <div>
                                    <span className='text-lg font-black'>
                                        {record.name.normalize('NFKC')}
                                    </span>
                                    {!record.isStandard &&
                                        <img
                                            src='https://maimaidx.jp/maimai-mobile/img/music_dx.png'
                                            className='inline h-4 ml-2 mb-2'
                                            alt='Delux'
                                        />
                                    }
                                </div>
                                <div>
                                    <span className='mr-4'>
                                        Lv. {record.level}
                                    </span>
                                    <span>
                                        <span className='text-xl font-bold mr-1'>
                                            {(record.score * 100).toFixed(4)}
                                        </span>
                                        %
                                    </span>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </section>
            <section>
                <h2>全国行脚 (プレイしたことがある都道府県)</h2>
                <Map
                    id='maimai'
                    path='/prefectures-simplify-20.svg'
                    viewBox='137.0 20.0 591.0 740.0'
                    fill={Object.fromEntries(
                        maimaiDataJson.prefectures.map(prefId => [prefId, '#e89402'])
                    )}
                    count={maimaiDataJson.prefectures.length}
                    maxCount={47}
                />
            </section>
        </Layout>
    );
};

export default App;
