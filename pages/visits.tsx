/** biome-ignore-all lint/correctness/useUniqueElementIds: ID は好きな文字列を置きたい */
import { Open, Square } from '@styled-icons/ionicons-outline';
import { Airplane } from '@styled-icons/ionicons-solid';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { sum } from 'lodash';
import type { NextPage } from 'next';
import Flag from 'react-world-flags';
import GeoMap from '../components/GeoMap';
import { IconAnchor } from '../components/iconTools';
import Layout from '../components/Layout';
import maimaiDataJson from '../data/generated/maimai.json';
import swarmDataJson from '../data/generated/swarm.json';
import type { MaimaiData } from '../data/schema/maimai';
import type { SwarmData } from '../data/schema/swarm';
import {
    type SenkyokuId,
    senkyokuResultColors,
} from '../data/senkyoku-result-colors';
import { type USStateCode, usStateColors } from '../data/us-state-colors';

const ColorSquare: React.FC<{
    color: string;
    verticalAlign?: string;
}> = ({ color, verticalAlign = '-6px' }) => (
    <Square
        className='mr-1 [&>path]:fill-inherit'
        fill={color}
        size='1.4em'
        style={{ fill: color, verticalAlign }}
    />
);

const partyColorToText: { [key: string]: string } = {
    '#2f3b84': '減',
    '#36c200': '維',
    '#0074bc': '中',
    '#777777': '無',
    '#d7033a': '自',
    '#f8bc00': '国',
};

const regularizeAirportName = (airportName: string) => {
    // 「日本語、なかったら英語 (現地語)」の形式になっているので、現地語を取り出す
    if (airportName.includes('(')) {
        return airportName.split('(')[1].replace(')', '').trim();
    }
    return airportName;
};

const swarmData = swarmDataJson as unknown as SwarmData;
const maimaiData = maimaiDataJson as unknown as MaimaiData;

const App: NextPage = () => {
    const senkyokuVisitCounts2022: { [key: string]: number } =
        Object.fromEntries(swarmData.senkyokuVisitCounts2022);

    // Manual edit:
    senkyokuVisitCounts2022['mie-4'] += 1; // 小学生のとき、伊勢、鳥羽など

    const visitedSenkyoku2022 = Object.entries(senkyokuVisitCounts2022)
        .filter(([, count]) => count > 0)
        .map(e => e[0]);
    const visitedSenkyokuColors = visitedSenkyoku2022.map(
        senkyokuId =>
            [
                senkyokuId,
                senkyokuResultColors[senkyokuId as SenkyokuId] ?? 'white',
            ] as [string, string],
    );
    const visitedSenkyokuColorSet = new Set(
        Object.values(senkyokuResultColors),
    );
    const visitedSenkyokuCountsByParty = Array.from(visitedSenkyokuColorSet)
        .map(
            color =>
                [
                    color,
                    visitedSenkyokuColors.filter(e => e[1] === color).length,
                    Object.entries(senkyokuResultColors).filter(
                        ([, v]) => v === color,
                    ).length,
                ] as [string, number, number],
        )
        .sort((a, b) =>
            a[1] === b[1] // 訪問数が同じだったら // 政党の小選挙区議席数 (母数) で判断
                ? a[2] === b[2] // それも同じだったら // 上の政党色辞書の順番で判断
                    ? Object.keys(partyColorToText).indexOf(a[0]) -
                      Object.keys(partyColorToText).indexOf(b[0])
                    : -(a[2] - b[2])
                : -(a[1] - b[1]),
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
            description='旅好き・hideo54がこれまでに訪れたことのある土地をまとめています。'
            title='訪問歴 | hideo54.com'
        >
            <h1 className='typography-h1'>訪問歴</h1>
            <div className='text-sm'>
                このページは自動生成されています。
                <br />
                使用データの範囲:{' '}
                {dayjs(swarmData.oldestCheckinDate).format('YYYY年M月D日')}–
                {dayjs(swarmData.newestCheckinDate).format('YYYY年M月D日')}
            </div>
            <section id='senkyoku'>
                <h2 className='typography-h2'>訪れたことのある小選挙区</h2>
                <GeoMap
                    alt='小選挙区地図'
                    CountSectionChildren={visitedSenkyokuCountsByParty.map(
                        ([color, visitedCount, allCount]) => (
                            <p className='my-1 text-sm' key={color}>
                                <ColorSquare
                                    color={color}
                                    verticalAlign='-4.5px'
                                />
                                <span className='mr-1 font-bold'>
                                    {partyColorToText[color]}
                                </span>
                                <span>
                                    {visitedCount} / {allCount}
                                </span>
                            </p>
                        ),
                    )}
                    count={visitedSenkyoku2022.length}
                    fill={Object.fromEntries(visitedSenkyokuColors)}
                    mapId='senkyoku'
                    maxCount={289}
                    path='/shu-2022-geo.svg'
                    viewBox='137 20 591 740'
                />
                <div className='my-4 leading-4'>
                    <small>
                        その小選挙区で当選した候補者の所属政党の色で塗っています。
                        <br />
                        小選挙区マップ:{' '}
                        <IconAnchor
                            href='https://senkyo.watch'
                            RightIcon={Open}
                        >
                            選挙ウォッチ
                        </IconAnchor>
                        から。
                    </small>
                </div>
                <section className='text-sm'>
                    <h3 className='typography-h3'>
                        Q. なぜ小選挙区で表すのか?
                    </h3>
                    <ul className='typography-list'>
                        <li>hideo54は日本政治が好きです。</li>
                        <li>
                            日本の小選挙区は、一票の格差を縮小するよう、小選挙区の有権者数
                            (≒人口)
                            がなるべく等しくなるように設計されており、東京都は30個、和歌山県は2個といった具合で配分されています。旅も同様に、「東京都に行ったことがある」のと「和歌山県に行ったことがある」のとでは重みが違うはずです。前者は「東京都のどこに行ったことがあるの?」となるでしょう。この重みはその土地の密度によるものとして、人口密度をある程度反映した地区わけとして小選挙区を利用することに意義を見出しています。
                        </li>
                    </ul>
                    {/* <h3>注意</h3>
                    <ul>
                        <li>その小選挙区で当選した候補者の<strong>現在の</strong>所属政党の色で塗っています。たとえば、その候補者が当時無所属で出馬し、その後自由民主党所属となった場合、自由民主党の色で塗っています。そのため、2021年の選挙結果とは微妙に異なった配色となっています。</li>
                    </ul> */}
                </section>
            </section>
            <section id='keikenchi'>
                <h2 className='typography-h2'>経県値</h2>
                <GeoMap
                    alt='都道府県地図'
                    CountSectionChildren={Array.from({ length: 6 }, (_, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: it can never be reordered
                        <p className='my-1' key={i}>
                            <ColorSquare color={keikenchiToColor(5 - i)} />
                            <span className='mr-1 font-bold'>
                                {
                                    [
                                        '居住',
                                        '宿泊',
                                        '訪問',
                                        '接地',
                                        '通過',
                                        '未踏',
                                    ][i]
                                }
                            </span>
                            {
                                Object.values(swarmData.keikenchi).filter(
                                    v => v === 5 - i,
                                ).length
                            }{' '}
                            / 47
                        </p>
                    ))}
                    count={sum(Object.values(swarmData.keikenchi))}
                    fill={Object.fromEntries(
                        Object.entries(swarmData.keikenchi).map(
                            ([prefId, value]) => [
                                prefId,
                                keikenchiToColor(value),
                            ],
                        ),
                    )}
                    mapId='keikenchi'
                    maxCount={5 * 47}
                    path='/prefectures-simplify-20.svg'
                    viewBox='137.0 20.0 591.0 740.0'
                />
            </section>
            <section id='maimai'>
                <h2 className='typography-h2'>
                    maimai 全国行脚 (プレイしたことがある都道府県)
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
            <section id='countries'>
                <h2 className='typography-h2'>訪れたことのある国と地域</h2>
                <ul className='grid grid-cols-2 gap-4 p-0 min-[600px]:grid-cols-3'>
                    {swarmData.allVisitedCountryCodes.map((countryCode, i) => (
                        <li
                            className='m-0 flex flex-col items-start gap-y-2'
                            key={countryCode}
                        >
                            <Flag
                                className='m-0 h-8 shadow'
                                code={countryCode}
                            />
                            <div className='text-balance text-sm leading-5'>
                                {swarmData.allVisitedCountries[i]}
                            </div>
                        </li>
                    ))}
                </ul>
                <GeoMap
                    additionalCss='path[class^="ADM0_A3-"],path.land,path.boundary{stroke:black;stroke-width:0.2;}path[class^="ADM0_A3-"],path.land{fill:white;}'
                    alt='世界地図'
                    count={swarmData.allVisitedCountryCodes.length}
                    fill={Object.fromEntries(
                        swarmData.allVisitedCountryCodes.map(cc => [
                            `ADM0_A3-${cc}`,
                            '#22c55e',
                        ]),
                    )}
                    idProvidedByClass
                    mapId='intl_wintri1'
                    path='/intl_wintri.svg'
                    viewBox='0 0 800 485'
                />
                <div className='my-4 leading-4'>
                    <small>
                        世界地図:{' '}
                        <IconAnchor
                            href='https://github.com/wri/wri-bounds'
                            RightIcon={Open}
                        >
                            wri/wri-bounds
                        </IconAnchor>{' '}
                        から。
                        なお北方領土は元素材でロシア領扱いだったものを日本領扱いに改変。
                    </small>
                </div>
            </section>
            <section id='us'>
                <h2 className='typography-h2'>
                    訪れたことのあるアメリカ合衆国の州
                </h2>
                <GeoMap
                    additionalCss='g.state{fill:white;}g.borders>path{stroke:black;stroke-width:0.5;}'
                    alt='アメリカ合衆国の州の地図'
                    count={swarmData.allVisitedUSStates.length}
                    fill={Object.fromEntries(
                        swarmData.allVisitedUSStates.map(stateId => [
                            stateId.toLowerCase(),
                            // According to 2020 presidential election result
                            usStateColors[stateId as USStateCode],
                        ]),
                    )}
                    idProvidedByClass
                    mapId='us'
                    maxCount={51}
                    path='/us-states.svg'
                    svgPadding='0 2em'
                    viewBox='0 0 940 593'
                />
                <div className='my-4 leading-4'>
                    <small>
                        50 states + District of Columbia. Color represents the
                        party with the majority of votes of the 2024
                        presidential election. Map:{' '}
                        <IconAnchor
                            href='https://commons.wikimedia.org/wiki/File:Blank_US_Map_(states_only).svg'
                            RightIcon={Open}
                        >
                            File:Blank US Map (states only).svg by Heitordp,
                            CC0, via Wikimedia Commons
                        </IconAnchor>
                    </small>
                </div>
            </section>
            <section id='airports'>
                <h2 className='typography-h2'>訪れたことのある空港</h2>
                <div className='my-4 flex items-end gap-x-8'>
                    <div className='font-bold text-4xl'>
                        {swarmData.visitedAirports.length}
                    </div>
                    <div className='flex grow flex-wrap items-center gap-x-4'>
                        {swarmData.visitedAirportsByCountry
                            .filter(({ count }) => count > 1)
                            .map(({ countryCode, count }) => (
                                <div
                                    className='flex items-center gap-x-2'
                                    key={countryCode}
                                >
                                    <Flag
                                        className='m-0 h-4 shadow'
                                        code={countryCode}
                                    />
                                    <span className='text-lg'>{count}</span>
                                </div>
                            ))}
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-4 min-[680px]:grid-cols-3'>
                    {swarmData.visitedAirports.map(airport => (
                        <div key={airport.name}>
                            <div className='flex items-center gap-2 font-bold text-2xl'>
                                <Airplane
                                    size='1.2em'
                                    style={{ verticalAlign: 'text-bottom' }}
                                />
                                <span
                                    className={clsx(
                                        airport.name
                                            .match(/[A-Z]{3}/)
                                            ?.toString() === 'KCZ' &&
                                            'animate-shine bg-kcz-gradient bg-size-[250%_100%] bg-clip-text text-transparent ease-in-out',
                                    )}
                                    id={airport.name
                                        .match(/[A-Z]{3}/)
                                        ?.toString()
                                        .toLowerCase()}
                                >
                                    {airport.name.match(/[A-Z]{3}/)}
                                </span>
                                <Flag
                                    className='m-0 h-4 shadow'
                                    code={airport.countryCode}
                                />
                            </div>
                            <div className='leading-snug'>
                                {regularizeAirportName(
                                    airport.name.replace(/\([A-Z]{3}\)/, ''),
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <section id='ramen'>
                <h2 className='typography-h2'>訪れたラーメン屋の総数</h2>
                <p className='mt-0 mb-4 font-bold text-4xl'>
                    {Object.keys(swarmData.ramenRestaurantsCheckinCount).length}
                </p>
                <h2 className='typography-h2'>たくさん訪れたラーメン屋</h2>
                <div className='leading-4'>
                    <small>
                        同一ラーメンチェーンの「〇〇店」といった支店名は除去し、まとめて計上しています。
                    </small>
                </div>
                <ul className='grid grid-cols-2 gap-4 p-0 min-[640px]:grid-cols-3'>
                    {Object.entries(swarmData.ramenRestaurantsCheckinCount)
                        .slice(0, 12)
                        .map(([restaurantName, count]) => (
                            <li
                                className='m-0 list-none p-0'
                                key={restaurantName}
                            >
                                <div className='flex items-baseline gap-1'>
                                    <span className='font-bold text-2xl'>
                                        {count}
                                    </span>
                                    <span className='text-xs'>回</span>
                                </div>
                                <div className='text-balance'>
                                    {restaurantName}
                                </div>
                            </li>
                        ))}
                </ul>
            </section>
        </Layout>
    );
};

export default App;
