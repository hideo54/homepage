import type { NextPage } from 'next';
import { Open, Square } from '@styled-icons/ionicons-outline';
import { Airplane } from '@styled-icons/ionicons-solid';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { sum } from 'lodash';
import { IconAnchor } from '../components/iconTools';
import Layout from '../components/Layout';
import Map from '../components/Map';
import maimaiDataJson from '../lib/maimai-data.json';
import swarmDataJson from '../lib/swarm-data.json';
import senkyokuResultColor2024Json from '../lib/shu-2024-senkyoku-result-color.json';
import usStateColorsJson from '../lib/us-state-colors.json';

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
    '#777777': '無',
    '#7957da': '共',
    '#0a82dc': '保',
    '#01a8ec': '社',
};

const regularizeAirportName = (airportName: string) => {
    // 「日本語、なかったら英語 (現地語)」の形式になっているので、現地語を取り出す
    if (airportName.includes('(')) {
        return airportName.split('(')[1].replace(')', '').trim();
    }
    return airportName;
};

const App: NextPage = () => {
    const senkyokuVisitCounts2022: {[key: string]: number} = Object.fromEntries(swarmDataJson.senkyokuVisitCounts2022);

    // Manual edit:
    senkyokuVisitCounts2022['mie-4'] += 1; // 小学生のとき、伊勢、鳥羽など

    const visitedSenkyoku2022 = Object.entries(senkyokuVisitCounts2022)
        .filter(([, count]) => count > 0)
        .map(e => e[0]);
    const visitedSenkyokuColors = visitedSenkyoku2022.map(senkyokuId => [
        senkyokuId,
        senkyokuResultColor2024Json[senkyokuId as keyof typeof senkyokuResultColor2024Json] || 'white',
    ] as [string, string]);
    const visitedSenkyokuColorSet = new Set(
        Object.values(senkyokuResultColor2024Json)
    );
    const visitedSenkyokuCountsByParty = Array.from(visitedSenkyokuColorSet)
        .map(color => [
            color,
            visitedSenkyokuColors.filter(e => e[1] === color).length,
            Object.entries(senkyokuResultColor2024Json).filter(([, v]) => v === color).length,
        ] as [string, number, number])
        .sort((a, b) =>
            a[1] === b[1] // 訪問数が同じだったら
                ? ( // 政党の小選挙区議席数 (母数) で判断
                    a[2] === b[2] // それも同じだったら
                        ? ( // 上の政党色辞書の順番で判断
                            Object.keys(partyColorToText).indexOf(a[0])
                            - Object.keys(partyColorToText).indexOf(b[0])
                        )
                        : - (a[2] - b[2])
                )
                : - (a[1] - b[1])
        );

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
            <div className='text-sm'>
                このページは自動生成されています。
                <br />
                使用データの範囲:{' '}
                {dayjs(swarmDataJson.oldestCheckinDate).format('YYYY年M月D日')}
                –
                {dayjs(swarmDataJson.newestCheckinDate).format('YYYY年M月D日')}
            </div>
            <section id='senkyoku'>
                <h2>訪れたことのある小選挙区</h2>
                <Map
                    id='senkyoku'
                    path='/shu-2022-geo.svg'
                    viewBox='137 20 591 740'
                    fill={Object.fromEntries(visitedSenkyokuColors)}
                    count={visitedSenkyoku2022.length}
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
                <div className='my-4 leading-4'>
                    <small>
                        その小選挙区で当選した候補者の所属政党の色で塗っています。
                        <br />
                        小選挙区マップ:{' '}
                        <IconAnchor href='https://senkyo.watch' RightIcon={Open}>選挙ウォッチ</IconAnchor>
                        から。
                    </small>
                </div>
                <section className='text-sm'>
                    <h3>Q. なぜ小選挙区で表すのか?</h3>
                    <ul>
                        <li>hideo54は日本政治が好きです。</li>
                        <li>日本の小選挙区は、一票の格差を縮小するよう、小選挙区の有権者数 (≒人口) がなるべく等しくなるように設計されており、東京都は30個、和歌山県は2個といった具合で配分されています。旅も同様に、「東京都に行ったことがある」のと「和歌山県に行ったことがある」のとでは重みが違うはずです。前者は「東京都のどこに行ったことがあるの?」となるでしょう。この重みはその土地の密度によるものとして、人口密度をある程度反映した地区わけとして小選挙区を利用することに意義を見出しています。</li>
                    </ul>
                    {/* <h3>注意</h3>
                    <ul>
                        <li>その小選挙区で当選した候補者の<strong>現在の</strong>所属政党の色で塗っています。たとえば、その候補者が当時無所属で出馬し、その後自由民主党所属となった場合、自由民主党の色で塗っています。そのため、2021年の選挙結果とは微妙に異なった配色となっています。</li>
                    </ul> */}
                </section>
            </section>
            <section id='keikenchi'>
                <h2>経県値</h2>
                <Map
                    id='keikenchi'
                    path='/prefectures-simplify-20.svg'
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
                        Array.from({ length: 6 }, (_, i) => (
                            <p key={i} className='my-1'>
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
                                {Object.values(swarmDataJson.keikenchi).filter(v => v === (5 - i)).length} / 47
                            </p>
                        ))
                    }
                />
            </section>
            <section id='maimai'>
                <h2>maimai 全国行脚 (プレイしたことがある都道府県)</h2>
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
            <section id='countries'>
                <h2>訪れたことのある国と地域</h2>
                <ul>
                    {swarmDataJson.allVisitedCountries.map(country =>
                        <li key={country}>{country}</li>
                    )}
                </ul>
                <Map
                    id='intl_wintri1'
                    path='/intl_wintri.svg'
                    viewBox='0 0 800 485'
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
                <div className='my-4 leading-4'>
                    <small>
                        世界地図:{' '}
                        <IconAnchor href='https://github.com/wri/wri-bounds' RightIcon={Open}>
                            wri/wri-bounds
                        </IconAnchor>
                        {' '}から。
                        なお北方領土は元素材でロシア領扱いだったものを日本領扱いに改変。
                    </small>
                </div>
            </section>
            <section id='us'>
                <h2>訪れたことのあるアメリカ合衆国の州</h2>
                <Map
                    id='us'
                    path='/us-states.svg'
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
                    svgPadding='0 2em'
                />
                <div className='my-4 leading-4'>
                    <small>
                        50 states + District of Columbia. Color represents the winner of the 2024 presidential election. For Maine and Nebraska, which have a split electoral vote system, the colors represent the majority of the votes.
                    </small>
                    <br />
                    <small>
                        マップ:{' '}
                        <IconAnchor
                            href='https://commons.wikimedia.org/wiki/File:Blank_US_Map_(states_only).svg'
                            RightIcon={Open}
                        >
                            File:Blank US Map (states only).svg by Heitordp, CC0, via Wikimedia Commons
                        </IconAnchor>
                    </small>
                </div>
            </section>
            <section id='airports'>
                <h2>訪れたことのある空港</h2>
                <p className='text-4xl font-bold mt-0 mb-4'>
                    {swarmDataJson.visitedAirports.length}
                </p>
                <div>
                    {swarmDataJson.visitedAirports.map(airportName =>
                        <div key={airportName} className='my-4'>
                            <div className='text-2xl font-bold mr-2'>
                                <Airplane size='1.2em' style={{ verticalAlign: 'text-bottom' }} />
                                <span
                                    className={clsx(
                                        airportName.match(/[A-Z]{3}/)?.toString() === 'KCZ' && (
                                            'text-transparent bg-kcz-gradient bg-[length:250%_100%] bg-clip-text animate-shine ease-in-out'
                                        ),
                                    )}
                                    id={airportName.match(/[A-Z]{3}/).toLowerCase()}
                                >
                                    {airportName.match(/[A-Z]{3}/)}
                                </span>
                            </div>
                            <span>
                                {regularizeAirportName(airportName.replace(/\([A-Z]{3}\)/, ''))}
                            </span>
                        </div>
                    )}
                </div>
            </section>
            <section id='ramen'>
                <h2>訪れたラーメン屋の総数</h2>
                <p className='text-4xl font-bold mt-0 mb-4'>
                    {Object.keys(swarmDataJson.ramenRestaurantsCheckinCount).length}
                </p>
                <p>うち、10回以上訪れている店舗</p>
                <ul>
                    {Object.entries(swarmDataJson.ramenRestaurantsCheckinCount)
                        .filter(([, count]) => count >= 10)
                        .map(([restaurantName, count]) =>
                            <li key={restaurantName}>
                                {restaurantName} ({count}回)
                            </li>
                        )
                    }
                </ul>
                <div className='my-4 leading-4'>
                    <small>
                        同一ラーメンチェーンの「〇〇店」といった支店名は除去し、まとめて計上しています。
                    </small>
                </div>
            </section>
        </Layout>
    );
};

export default App;
