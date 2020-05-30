import React from 'react';
import {
    LocalImage,
    CustomWordBreak,
    UnorderedList,
    ExternalAnchor,
} from '../components';
import { Center, BigTitle } from '../styles';

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
    </>;
}
