import GeoMap from '../components/GeoMap';
import Layout from '../components/Layout';
import maimaiDataJson from '../data/generated/maimai.json';
import type { MaimaiData } from '../data/schema/maimai';

const maimaiData = maimaiDataJson as unknown as MaimaiData;

const App = () => {
    return (
        <Layout
            description='ほとんどのゲームが苦手なhideo54がまあ嫌いなわけでもない音楽ゲーム「maimaiでらっくす」のプレイ情報です。'
            title='maimai でらっくす プレイ状況 | hideo54.com'
        >
            <h1 className='typography-h1'>maimai でらっくす</h1>
            <p className='typography-p'>
                ほとんどのゲームが苦手なhideo54がまあ嫌いなわけでもない音楽ゲーム「maimaiでらっくす」のプレイ状況です。
            </p>
            <section>
                <h2 className='typography-h2'>
                    スコア 100% 超えの Expert 楽曲
                </h2>
                <ul className='typography-list'>
                    {maimaiData.expertRecords
                        .filter(record => record.score > 1.0)
                        .map(record => (
                            <li key={record.name}>
                                <div>
                                    <span className='font-bold text-lg'>
                                        {record.name.normalize('NFKC')}
                                    </span>
                                    {!record.isStandard && (
                                        // biome-ignore lint/performance/noImgElement: 仕方ない
                                        <img
                                            alt='Deluxe'
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
                <h2 className='typography-h2'>
                    全国行脚 (プレイしたことがある都道府県)
                </h2>
                <GeoMap
                    alt='都道府県地図'
                    count={maimaiData.prefectures.length}
                    fill={Object.fromEntries(
                        maimaiData.prefectures.map(prefId => [
                            prefId,
                            '#e89402',
                        ]),
                    )}
                    mapId='maimai'
                    maxCount={47}
                    path='/prefectures-simplify-20.svg'
                    viewBox='137.0 20.0 591.0 740.0'
                />
            </section>
        </Layout>
    );
};

export default App;
