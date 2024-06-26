import type { NextPage } from 'next';
import { Open, Square } from '@styled-icons/ionicons-outline';
import { Airplane } from '@styled-icons/ionicons-solid';
import { countBy, sum } from 'lodash';
import { IconAnchor, IconSpan } from '../components/iconTools';
import Layout from '../components/Layout';
import Map from '../components/Map';
import maimaiDataJson from '../lib/maimai-data.json';
import swarmDataJson from '../lib/swarm-data.json';
import senkyokuResultColorJson from '../lib/shu-2021-senkyoku-result-color.json';
import usStateColorsJson from '../lib/us-state-colors.json';
import PrefecturesMapSvg from '../public/prefectures-simplify-20.svg';
import Shu2017GeoSvg from '../public/shu-2017-geo.svg';
import WorldMapSvg from '../public/intl_wintri.svg';
import USStatesMapSvg from '../public/us-states.svg';

const ColorSquare: React.FC<{
    color: string;
    verticalAlign?: string;
}> = ({ color, verticalAlign = '-6px' }) => (
    <Square
        size='1.4em'
        fill={color}
        className='mr-1 [&>path]:fill-inherit'
        style={{ fill: color, verticalAlign }}
    />
);

const partyColorToText: {[key: string]: string} = {
    '#d7033a': '自',
    '#004098': '立',
    '#36c200': '維',
    '#f55881': '公',
    '#f8bc00': '国',
    '#053f9b': '教',
    '#777777': '無',
    '#7957da': '共',
    '#01a8ec': '社',
};

const App: NextPage = () => {
    const senkyokuVisitCounts2017: {[key: string]: number} = Object.fromEntries(swarmDataJson.senkyokuVisitCounts2017);

    // Manual edit:
    senkyokuVisitCounts2017['mie-4'] += 1; // 小学生のとき、伊勢、鳥羽など
    senkyokuVisitCounts2017['wakayama-1'] += 1; // マリーナシティが地図の簡略化により抜けてしまっている
    senkyokuVisitCounts2017['wakayama-3'] += 1; // 小学生の時、白浜

    const visitedSenkyoku = Object.entries(senkyokuVisitCounts2017)
        .filter(([, count]) => count > 0)
        .map(e => e[0]);
    const visitedSenkyokuColors = visitedSenkyoku.map(senkyokuId => [
        senkyokuId,
        senkyokuResultColorJson[senkyokuId as keyof typeof senkyokuResultColorJson] || 'white',
    ] as [string, string]);
    const visitedSenkyokuColorSet = new Set(
        visitedSenkyokuColors.map(e => e[1])
    );
    const visitedSenkyokuCountsByParty = Array.from(visitedSenkyokuColorSet)
        .map(color => [
            color,
            visitedSenkyokuColors.filter(e => e[1] === color).length,
            Object.entries(senkyokuResultColorJson).filter(([, v]) => v === color).length,
        ] as [string, number, number])
        .sort((a, b) => a[1] === b[1] ? - (a[2] - b[2]) : - (a[1] - b[1]));

    const keikenchiToColor = (keikenchi: number) => {
        if (keikenchi === 5) return '#e87afd';
        if (keikenchi === 4) return '#f56d64';
        if (keikenchi === 3) return '#faff79';
        if (keikenchi === 2) return '#bbf59d';
        if (keikenchi === 1) return '#b7ddfd';
        return '#ffffff';
    };

    return (
        <Layout
            title='訪問歴 | hideo54.com'
            description='旅好き・hideo54がこれまでに訪れたことのある土地をまとめています。'
        >
            <h1>訪問歴</h1>
            <section>
                <h2>訪れたことのある小選挙区</h2>
                <Map
                    id='senkyoku'
                    Svg={Shu2017GeoSvg}
                    viewBox='100 15 433 540'
                    fill={Object.fromEntries(visitedSenkyokuColors)}
                    count={visitedSenkyoku.length}
                    maxCount={289}
                    CountSectionChildren={
                        visitedSenkyokuCountsByParty.map(([color, visitedCount, allCount]) =>
                            <p key={color} className='my-1 text-sm'>
                                <ColorSquare color={color} verticalAlign='-4.5px' />
                                <span className='mr-1 font-bold'>
                                    {partyColorToText[color]}
                                </span>
                                <span>
                                    {visitedCount} / {allCount}
                                </span>
                            </p>
                        )
                    }
                />
                <p>
                    ※ 新区割りでは {
                        (swarmDataJson.senkyokuVisitCounts2022 as [string, number][]).filter(e => e[1] > 0).length
                    } / 289 に。
                </p>
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
                <h2>経県値</h2>
                <Map
                    id='keikenchi'
                    Svg={PrefecturesMapSvg}
                    viewBox='137.0 20.0 591.0 740.0'
                    fill={Object.fromEntries(
                        Object.entries(swarmDataJson.keikenchi).map(([prefId, value]) => [
                            prefId,
                            keikenchiToColor(value),
                        ])
                    )}
                    count={sum(Object.values(swarmDataJson.keikenchi))}
                    maxCount={5 * 47}
                    CountSectionChildren={
                        Object.entries(countBy(swarmDataJson.keikenchi))
                            .reverse()
                            .map(([prefId, count], i) =>
                                <p key={prefId} className='my-1'>
                                    <ColorSquare color={keikenchiToColor(5 - i)} />
                                    <span className='mr-1 font-bold'>
                                        {[
                                            '居住',
                                            '宿泊',
                                            '訪問',
                                            '接地',
                                            '通過',
                                            '未踏',
                                        ][i]}
                                    </span>
                                    {count} / 47
                                </p>
                            )
                    }
                />
            </section>
            <section>
                <h2>maimai 全国行脚 (プレイしたことがある都道府県)</h2>
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
            <section>
                <h2>訪れたことのある国と地域</h2>
                <ul>
                    {swarmDataJson.allVisitedCountries.map(country =>
                        <li key={country}>{country}</li>
                    )}
                </ul>
                <Map
                    id='intl_wintri1'
                    Svg={WorldMapSvg}
                    viewBox='0 140 800 200'
                    fill={Object.fromEntries(
                        swarmDataJson.allVisitedCountryCodes.map(cc => [
                            'ADM0_A3-' + cc,
                            '#22c55e',
                        ])
                    )}
                    idProvidedByClass
                    count={swarmDataJson.allVisitedCountryCodes.length}
                    additionalCss='path[class^="ADM0_A3-"],path.land,path.boundary{stroke:black;stroke-width:0.2;}path[class^="ADM0_A3-"],path.land{fill:white;}'
                />
                <p>
                    <small>
                        世界地図:{' '}
                        <IconAnchor href='https://github.com/wri/wri-bounds' RightIcon={Open}>
                            wri/wri-bounds
                        </IconAnchor>
                        {' '}から
                    </small>
                </p>
            </section>
            <section>
                <h2>訪れたことのあるアメリカ合衆国の州</h2>
                <Map
                    id='us'
                    Svg={USStatesMapSvg}
                    viewBox='0 0 940 593'
                    fill={Object.fromEntries(
                        swarmDataJson.allVisitedUSStates.map(stateId => [
                            stateId.toLowerCase(),
                            // According to 2020 presidential election result
                            usStateColorsJson[stateId as keyof typeof usStateColorsJson],
                        ])
                    )}
                    idProvidedByClass
                    count={swarmDataJson.allVisitedUSStates.length}
                    maxCount={51}
                    additionalCss='g.state{fill:white;}g.borders>path{stroke:black;stroke-width:0.5;}'
                />
                <div>
                    <small>50 states + District of Columbia.</small>
                </div>
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
            <section>
                <h2>訪れたことのある空港</h2>
                <p>飛行機だいすきなので。</p>
                <div>
                    {swarmDataJson.visitedAirports.map(airportName =>
                        <div key={airportName} className='my-2'>
                            <div className='text-2xl font-bold'>
                                <IconSpan LeftIcon={Airplane}>
                                    {airportName.match(/[A-Z]{3}/)}
                                </IconSpan>
                            </div>
                            {airportName.replace(/\([A-Z]{3}\)/, '').trim()}
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
};

export default App;
