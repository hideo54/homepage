import React from 'react';
import {
    Section,
    LocalImage,
    CustomWordBreak,
    UnorderedList,
    ExternalAnchor,
} from '../components';
import { Main, Footer, Center, BigTitle, Code, Small, Li } from '../styles';

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
            <Section title='好きなもの'>
                <UnorderedList list={likes} />
            </Section>
            <Section title='現在の所属'>
                <UnorderedList list={belongs} />
            </Section>
            <Section title='いた'>
                <UnorderedList list={was} />
            </Section>
            <Section title='連絡先'>
                <ul>
                    <Li>Twitter: <ExternalAnchor href='https://twitter.com/hideo54'>@hideo54</ExternalAnchor></Li>
                    <Li>E-mail: <Code>contact@hideo54.com</Code></Li>
                </ul>
            </Section>
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
