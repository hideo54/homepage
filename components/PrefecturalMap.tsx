import styled from 'styled-components';
import PrefecturalMapSvg from '../public/prefectures-simplify-20.svg';

const MapWrapperDiv = styled.div`
    position: relative;
    fill: white;
    stroke: black;
    stroke-width: 0.2;
    background-color: #a5c1fa;
    & > svg {
        width: 100%;
        max-height: 120vw;
    }
`;

const CountSection = styled.section`
    position: absolute;
    top: 0;
    padding: 0.5rem;
    span.big {
        font-size: 2rem;
        font-weight: bold;
    }
`;

const PrefecturalMap: React.FC<{
    fill: {[keys: string]: string};
    count: number;
}> = ({ fill, count }) => (
    <MapWrapperDiv>
        <PrefecturalMapSvg viewBox='137.0 20.0 591.0 740.0' />
        <style dangerouslySetInnerHTML={{
            __html: Object.entries(fill)
                .map(([prefId, color]) => `#${prefId}{fill:${color};}`)
                .join(''),
        }} />
        <CountSection>
            <p>
                <span className='big'>{count}</span>
                <span> / 47</span>
            </p>
        </CountSection>
    </MapWrapperDiv>
);

export default PrefecturalMap;
