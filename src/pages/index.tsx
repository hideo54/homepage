import React from 'react';
import {
    Section,
    LocalImage,
    CustomWordBreak,
    UnorderedList,
    ExternalAnchor,
} from '../components';
import { Main, Footer, Center, Code, Small, Li } from '../styles';

const likes = [
    'プログラミング (web, iOS, IoT, etc.)',
    'アニメ、マンガ',
    '言語',
    '美味しいもの',
    '温泉、サウナ',
    '一人旅',
];

const belongs = [
    '東京大学教養学部前期課程 (理科1類)',
    <ExternalAnchor href='https://tsg.ne.jp/'>
        東京大学コンピュータ系サークル TSG
    </ExternalAnchor>,
    <ExternalAnchor href='https://sunpro.io/'>
        SunPro (趣味プログラマーサークル)
    </ExternalAnchor>,
];

const was = [
    '灘校パソコン研究部 (NPCA)',
    'セキュリティ・キャンプ (参加: 2016全国、チューター: 2018山梨、2019福岡、2019沖縄)',
    'SECCON Final 2016, 2019',
];

export default () => {
    return <>
        <Center>
            <LocalImage src='/icon-main.png' width='200px' isRounded />
            <h1>hideo54</h1>
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
            <p>私個人へは、上記の所属先は通さずに直接ご連絡ください。</p>
        </Section>
        <Section title='いた'>
            <UnorderedList list={was} />
        </Section>
        <Section title='もう少し詳しい自己紹介' href='/intro' />
        <Section title='活動' href='/activity' />
        <Section title='連絡先'>
            <ul>
                <Li>Twitter: <ExternalAnchor href='https://twitter.com/hideo54'>@hideo54</ExternalAnchor></Li>
                <Li>E-mail: <Code>contact@hideo54.com</Code></Li>
            </ul>
        </Section>
        <Section title='アカウント一覧' href='/accounts' />
        <Section title='hideo54 Pay' href='/pay' />
        <Section title='ブログ' href='https://blog.hideo54.com' attachReferrer />
        <Section title='Amazon ほしいものリスト' href='https://www.amazon.co.jp/registry/wishlist/3IQ53EU2L62AI' />
        <p style={{ marginTop: '2em' }}>
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
        </p>
    </>;
}
