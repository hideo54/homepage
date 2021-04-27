import styled from 'styled-components';
import { Github } from '@styled-icons/fa-brands';
import Layout from '../components/Layout';
import { GoBackIconLink, IconLink } from '../components/atoms';

const GrassCoverDiv = styled.div<{ height: number; }>`
    position: relative;
    top: 0;
    width: 100%;
    height: ${props => props.height}px;
    overflow: hidden;
    img, p {
        transition: transform 0.2s linear;
    }
    &:hover {
        img, p {
            transform: scale(1.1);
        }
    }
`;

const GrassImg = styled.img<{ height: number; }>`
    width: 100%;
    height: ${props => props.height}px;
    object-fit: cover;
    object-position: right;
`;

const GitHubProfileP = styled.p`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    font-size: 2em;
    text-align: center;
    background-color: #333333AA;
`;

const GitHubProfileBanner: React.FC<{ height: number; }> = ({ height }) => {
    const url = 'https://github.com/hideo54';
    const date = '2021-04-26'; // tmp
    return (
        <a href={url} target='_blank' rel='noopener noreferrer'>
            <GrassCoverDiv height={height}>
                <GrassImg src={`https://img.hideo54.com/github-grass/${date}.svg`} height={height} />
                <GitHubProfileP>
                    <IconLink href={url} LeftIcon={Github} color='#CCCCCC' margin='0.2em'>hideo54</IconLink>
                </GitHubProfileP>
            </GrassCoverDiv>
        </a>
    );
};

const main = () => {
    return (
        <Layout>
            <nav style={{ margin: '1em 0' }}>
                <GoBackIconLink href='/'>トップページ</GoBackIconLink>
            </nav>
            <h1>Works</h1>
            <GitHubProfileBanner height={200} />
        </Layout>
    );
}

export default main;
