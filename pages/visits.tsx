import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import { Open } from '@styled-icons/ionicons-outline';
import { IconAnchor } from '@hideo54/reactor';
import axios from 'axios';
import Layout from '../components/Layout';
import senkyokuVisitCountsJson from '../lib/senkyoku-visit-counts.json';

const ShuMapWrapperDiv = styled.div`
    fill: white;
    stroke: black;
    stroke-width: 0.2;
`;

const App: NextPage = () => {
    const [shuSvg, setShuSvg] = useState('');
    const [districtColors, setDistrictColors] = useState<{[key in string]: string}>({});
    useEffect(() => {
        (async () => {
            const svgRes = await axios.get('https://senkyo.watch/assets/maps/shu-2022-geo.svg');
            setShuSvg(svgRes.data);
            const colorsRes = await axios.get('https://senkyo.watch/data/shu/district-colors.json');
            setDistrictColors(colorsRes.data);
        })();
    });
    return (
        <Layout
            title='訪問歴 | hideo54.com'
            description='hideo54が所持している各サービスのアカウントの一覧です。'
        >
            <h1>訪問歴</h1>
            <h2>訪れたことのある小選挙区</h2>
            <ShuMapWrapperDiv dangerouslySetInnerHTML={{ __html: shuSvg }} />
            <style dangerouslySetInnerHTML={{
                __html: senkyokuVisitCountsJson
                    .filter(([, count]) => count > 0)
                    .map(([senkyokuId]) => `#${senkyokuId}{fill:${districtColors[senkyokuId] || 'white'};}`)
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
                <p><strong>Q. なぜ小選挙区で表すのか?</strong></p>
                <ul>
                    <li>hideo54は日本政治が好きです。</li>
                    <li>日本の小選挙区は、一票の格差を縮小するよう、なるべく小選挙区の有権者数 (≒人口) がなるべく等しくなるように設計されており、東京都は30個、和歌山県は2個といった具合で配分されています。旅も同様に、「東京都に行ったことがある」のと「和歌山県に行ったことがある」のとでは重みが違うはずです。前者は「東京都のどこに行ったことがあるの?」となるでしょう。この重みはその土地の密度によるものとして、人口密度をある程度反映した地区わけとして小選挙区を利用することに意義を見出しています。</li>
                </ul>
            </section>
        </Layout>
    );
};

export default App;
