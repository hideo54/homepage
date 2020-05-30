import React from 'react';
import {
    LocalImage,
    CustomWordBreak,
    UnorderedList,
    ExternalAnchor,
} from '../components';
import { Main, Footer, Center, BigTitle, Code, Small } from '../styles';

const likes = [
    'プログラミング (Web, iOS, IoT, etc.)',
    'アニメ、マンガ',
    '言語',
    '美味しいもの',
    '温泉、サウナ',
    '一人旅',
];

const belongs = [
    '東京大学教養学部前期課程(理科1類)',
    <ExternalAnchor href='https://tsg.ne.jp/'>
        東京大学コンピュータ系サークルTSG
    </ExternalAnchor>,
    // <ExternalAnchor href='https://sunpro.io/'>
    //     SunPro (趣味プログラマーサークル)
    // </ExternalAnchor>,
];

const was = [
    '灘校パソコン研究部 (NPCA)',
    'セキュリティ・キャンプ (参加: 2016全国、チューター: 2018山梨、2019福岡、2019沖縄)',
    'SECCON Final 2016, 2019',
];

export default () => {
    return <>
        <Main>
            <Center>
                <LocalImage src='/icon-main.png' width='200px' isRounded />
                <BigTitle>hideo54</BigTitle>
                <p>1999年8月2日生まれ、20歳。</p>
                <CustomWordBreak>
                    コンピュータを使って\遊ぶのが\好き。
                </CustomWordBreak>
            </Center>
            <section>
                <h2>好きなもの</h2>
                <UnorderedList list={likes} />
            </section>
            <section>
                <h2>所属</h2>
                <UnorderedList list={belongs} />
            </section>
            <section>
                <h2>いた</h2>
                <UnorderedList list={was} />
            </section>
            <section>
                <h2>連絡先</h2>
                <ul>
                    <li>Twitter: <ExternalAnchor href='https://twitter.com/hideo54'>@hideo54</ExternalAnchor></li>
                    <li>E-mail: <Code>contact@hideo54.com</Code></li>
                </ul>
            </section>
        </Main>
        <Footer>
            <Small>
                アイコンのキツネは、Webブラウザ “Firefox” のマスコットキャラクター「フォクすけ」です。
                <ExternalAnchor href='https://creativecommons.org/licenses/by-nc/4.0/deed.ja'>
                    CC BY-NC 4.0 ライセンス
                </ExternalAnchor>
                で提供された、Mozilla Japan による
                <ExternalAnchor href='http://foxkeh.jp/downloads/materials/'>
                    画像素材
                </ExternalAnchor>
                を使用しています。
            </Small>
        </Footer>
    </>;
}
