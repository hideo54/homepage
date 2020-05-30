import React from 'react';
import { LocalImage } from '../components';
import { Center, BigTitle } from '../styles';

export default () => {
    return <>
        <Center>
            <LocalImage src='/main.png' width='200px' isRounded />
            <BigTitle>hideo54</BigTitle>
        </Center>
    </>;
}
