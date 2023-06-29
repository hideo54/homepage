import styled from 'styled-components';
import USStatesMapSvg from '../public/us-states.svg';

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

const USStateMap: React.FC<{
    fill: {[keys: string]: string};
    count: number;
}> = ({ fill, count }) => (
    <MapWrapperDiv>
        <USStatesMapSvg viewBox='0 0 940 593' />
        <style dangerouslySetInnerHTML={{
            __html: Object.entries(fill)
                .map(([prefId, color]) => `path.${prefId}{fill:${color};}`)
                .join(''),
        }} />
        <CountSection>
            <p>
                <span className='big'>{count}</span>
                <span> / 50</span>
            </p>
        </CountSection>
    </MapWrapperDiv>
);

export default USStateMap;
