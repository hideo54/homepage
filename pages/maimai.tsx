import styled from 'styled-components';
import Layout from '../components/Layout';
import Map from '../components/Map';
import maimaiDataJson from '../lib/maimai-data.json';
import PrefecturesMapSvg from '../public/prefectures-simplify-20.svg';

const RecordLi = styled.li`
    margin-bottom: 1rem;
    span.name {
        font-size: 1.3rem;
        font-weight: 600;
        margin-right: 0.5rem;
    }
    img.delux {
        height: 16px;
    }
    span.level {
        margin-right: 1rem;
    }
    span.score {
        span.big {
            font-size: 1.5rem;
            font-weight: 900;
            margin-right: 0.2rem;
        }
    }
`;

const App = () => {
    return (
        <Layout
            title='maimai でらっくす | hideo54.com'
            description='hideo54がまあ嫌いなわけでもない音楽ゲーム「maimaiでらっくす」のプレイ情報です。'
        >
            <h1>maimai でらっくす</h1>
            <p>hideo54がまあ嫌いなわけでもない音楽ゲーム「maimaiでらっくす」のプレイ情報です。</p>
            <section>
                <h2>スコア 100% 超えの Expert 楽曲</h2>
                <ul>
                    {maimaiDataJson.expertRecords
                        .filter(record => record.score > 1.0)
                        .map(record => (
                            <RecordLi key={record.name}>
                                <div>
                                    <span className='name'>{record.name.normalize('NFKC')}</span>
                                    {!record.isStandard &&
                                        <img
                                            src='https://maimaidx.jp/maimai-mobile/img/music_dx.png'
                                            className='delux'
                                            alt='Delux'
                                        />
                                    }
                                </div>
                                <div>
                                    <span className='level'>Lv. {record.level}</span>
                                    <span className='score'>
                                        <span className='big'>{(record.score * 100).toFixed(4)}</span>
                                        %
                                    </span>
                                </div>
                            </RecordLi>
                        ))
                    }
                </ul>
            </section>
            <section>
                <h2>maimai をプレイしたことがある都道府県</h2>
                <Map
                    id='maimai'
                    Svg={PrefecturesMapSvg}
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
