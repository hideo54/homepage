import { getPrefectureName, prefectureIds, type PrefectureId } from 'jp-local-gov';
import Layout from '../components/Layout';
import maimaiDataJson from '../lib/maimai-data.json';

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
                            <li key={record.name}>
                                {record.name.normalize('NFKC')}
                                {(record.score * 100).toFixed(4)}%
                            </li>
                        ))
                    }
                </ul>
            </section>
            <section>
                <h2>maimai をプレイしたことがある都道府県</h2>
                <ul>
                    {(maimaiDataJson.prefectures as PrefectureId[]).sort((a, b) => (
                        prefectureIds.indexOf(a) < prefectureIds.indexOf(b) ? -1 : 1
                    )).map(pref =>
                        <li key={pref}>
                            {getPrefectureName(pref)}
                        </li>
                    )}
                </ul>
            </section>
        </Layout>
    );
};

export default App;
