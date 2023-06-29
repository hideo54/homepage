import styled from 'styled-components';

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
    span {
        color: #333333;
    }
    span.big {
        font-size: 2rem;
        font-weight: bold;
    }
    p.item {
        color: #333333;
        font-size: 0.9rem;
        margin-bottom: 0.45rem;
    }
    svg {
        margin-right: 0.2rem;
        vertical-align: -5px;
        path {
            fill: inherit;
            stroke-width: 24;
        }
    }
`;

const Map: React.FC<{
    Svg: React.FC<{ viewBox?: string; id: string; }>;
    viewBox: string;
    idProvidedByClass?: boolean;
    fill: {[keys: string]: string};
    count: number;
    maxCount: number;
    CountSectionChildren?: React.ReactNode;
    id: string;
    additionalCss?: string;
}> = props => (
    <MapWrapperDiv>
        <props.Svg viewBox={props.viewBox} id={props.id} />
        <style dangerouslySetInnerHTML={{
            __html: (props.additionalCss || '') + Object.entries(props.fill)
                .map(([prefId, color]) =>
                    `#${props.id} path${props.idProvidedByClass ? '.' : '#'}${prefId}{fill:${color};}`
                ).join(''),
        }} />
        <CountSection>
            <p>
                <span className='big'>{props.count}</span>
                <span> / {props.maxCount}</span>
            </p>
            {props.CountSectionChildren}
        </CountSection>
    </MapWrapperDiv>
);

export default Map;
