import type { NextPage } from 'next';
import styled from 'styled-components';
import { Open, Square } from '@styled-icons/ionicons-outline';
import { IconAnchor } from '@hideo54/reactor';
import Layout from '../components/Layout';
import senkyokuVisitCountsJson from '../lib/senkyoku-visit-counts.json';
import senkyokuResultColorJson from '../lib/shu-2021-senkyoku-result-color.json';
import Shu2017GeoSvg from '../lib/shu-2017-geo.svg';

const ShuMapWrapperDiv = styled.div`
    fill: white;
    stroke: black;
    stroke-width: 0.2;
    background-color: #a5c1fa;
    svg {
        width: 100%;
        max-height: 120vw;
    }
`;

const CountSection = styled.section`
    position: absolute;
    padding: 0.5rem;
    p.item {
        margin-bottom: 0.4rem;
    }
    span.big {
        font-size: 2rem;
        font-weight: bold;
    }
    svg path {
        fill: inherit;
        stroke-width: 24;
    }
`;

const App: NextPage = () => {
    const visitedSenkyokuCount = senkyokuVisitCountsJson.filter(([, count]) => count > 0).length;
    const visitedSenkyokuColors = senkyokuVisitCountsJson
        .filter(([, count]) => count > 0)
        .map(([senkyokuId]) => [
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
    return (
        <Layout
            title='訪問歴 | hideo54.com'
            description='旅好き・hideo54がこれまでに訪れたことのある土地をまとめています。'
        >
            <h1>訪問歴</h1>
            <h2>訪れたことのある小選挙区 (2021)</h2>
            <CountSection>
                <p>
                    <span className='big'>{visitedSenkyokuCount}</span>
                    <span> / 289</span>
                </p>
                {visitedSenkyokuCountsByParty.map(([color, visitedCount, allCount]) =>
                    <p key={color} className='item'>
                        <Square size='1.6em' fill={color} />
                        {visitedCount} / {allCount}
                    </p>
                )}
            </CountSection>
            <ShuMapWrapperDiv>
                <Shu2017GeoSvg />
            </ShuMapWrapperDiv>
            <style dangerouslySetInnerHTML={{
                __html: visitedSenkyokuColors
                    .map(([senkyokuId, color]) => `#${senkyokuId}{fill:${color};}`)
                    .join(''),
            }} />
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
        </Layout>
    );
};

export default App;
