import React from 'react';
import { LocalImage, CustomWordBreak, UnorderedList } from '../components';
import { Center, BigTitle } from '../styles';

const likes = [
    'プログラミング (Web, iOS, IoT, etc.)',
    'アニメ、マンガ',
    '言語',
    '美味しいもの',
    '温泉、サウナ',
    '一人旅',
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
    </>;
}
