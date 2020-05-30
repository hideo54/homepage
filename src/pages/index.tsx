import React from 'react';
import { LocalImage, CustomWordBreak } from '../components';
import { Center, BigTitle } from '../styles';

export default () => {
    return <>
        <Center>
            <LocalImage src='/main.png' width='200px' isRounded />
            <BigTitle>hideo54</BigTitle>
            <p>1999年8月2日生まれ、20歳。</p>
            <CustomWordBreak>
                コンピュータを使って\遊ぶのが\好き。
            </CustomWordBreak>
        </Center>
    </>;
}
