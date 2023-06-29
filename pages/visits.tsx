import type { NextPage } from 'next';
import { Open } from '@styled-icons/ionicons-outline';
import { IconAnchor } from '@hideo54/reactor';
import Layout from '../components/Layout';
import PrefecturalMap from '../components/PrefecturalMap';
import USStatesMap from '../components/USStatesMap';
import VisitedSenkyokuMap from '../components/VisitedSenkyokuMap';
import maimaiDataJson from '../lib/maimai-data.json';
import swarmDataJson from '../lib/swarm-data.json';

const App: NextPage = () => {
    const senkyokuVisitCounts: {[key: string]: number} = Object.fromEntries(swarmDataJson.senkyokuVisitCounts);

    // Manual edit:
    senkyokuVisitCounts['mie-4'] += 1; // 小学生のとき、伊勢、鳥羽など
    senkyokuVisitCounts['wakayama-1'] += 1; // マリーナシティが地図の簡略化により抜けてしまっている
    senkyokuVisitCounts['wakayama-3'] += 1; // 小学生の時、白浜

    const visitedSenkyoku = Object.entries(senkyokuVisitCounts)
        .filter(([, count]) => count > 0)
        .map(e => e[0]);

    return (
        <Layout
            title='訪問歴 | hideo54.com'
            description='旅好き・hideo54がこれまでに訪れたことのある土地をまとめています。'
        >
            <h1>訪問歴</h1>
            <section>
                <h2>訪れたことのある小選挙区</h2>
                <VisitedSenkyokuMap visitedSenkyoku={visitedSenkyoku} />
                <p>
                    <small>
                        小選挙区マップ:{' '}
                        <IconAnchor href='https://senkyo.watch' RightIcon={Open}>選挙ウォッチ</IconAnchor>
                        から
                    </small>
                </p>
                <section>
                    <h3>Q. なぜ小選挙区で表すのか?</h3>
                    <ul>
                        <li>hideo54は日本政治が好きです。</li>
                        <li>日本の小選挙区は、一票の格差を縮小するよう、小選挙区の有権者数 (≒人口) がなるべく等しくなるように設計されており、東京都は30個、和歌山県は2個といった具合で配分されています。旅も同様に、「東京都に行ったことがある」のと「和歌山県に行ったことがある」のとでは重みが違うはずです。前者は「東京都のどこに行ったことがあるの?」となるでしょう。この重みはその土地の密度によるものとして、人口密度をある程度反映した地区わけとして小選挙区を利用することに意義を見出しています。</li>
                    </ul>
                    <h3>注意</h3>
                    <ul>
                        <li>2021年の衆議院議員選挙時点での区割りデータを使用しており、2022年に変更された、いわゆる「新区割り」とは異なります。</li>
                        <li>その小選挙区で当選した候補者の<strong>現在の</strong>所属政党の色で塗っています。たとえば、その候補者が当時無所属で出馬し、その後自由民主党所属となった場合、自由民主党の色で塗っています。そのため、2021年の選挙結果とは微妙に異なった配色となっています。</li>
                    </ul>
                </section>
            </section>
            <section>
                <h2>maimai をプレイしたことがある都道府県</h2>
                <PrefecturalMap
                    fill={Object.fromEntries(
                        maimaiDataJson.prefectures.map(prefId => [prefId, '#e89402'])
                    )}
                    count={maimaiDataJson.prefectures.length}
                />
            </section>
            <section>
                <h2>訪れたことのある国</h2>
                <ul>
                    {swarmDataJson.allVisitedCountries.map(country =>
                        <li key={country}>{country}</li>
                    )}
                </ul>
            </section>
            <section>
                <h2>訪れたことのあるアメリカ合衆国の州</h2>
                <USStatesMap
                    fill={Object.fromEntries(
                        swarmDataJson.allVisitedUSStates.map(stateId => [stateId.toLowerCase(), '#244999'])
                    )}
                    count={swarmDataJson.allVisitedUSStates.length}
                />
                <small>
                    マップ:{' '}
                    <IconAnchor
                        href='https://commons.wikimedia.org/wiki/File:Blank_US_Map_(states_only).svg'
                        RightIcon={Open}
                    >
                        File:Blank US Map (states only).svg by Heitordp, CC0, via Wikimedia Commons
                    </IconAnchor>
                </small>
            </section>
        </Layout>
    );
};

export default App;
