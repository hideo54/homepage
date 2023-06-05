import styled from 'styled-components';
import { Square } from '@styled-icons/ionicons-outline';
import swarmDataJson from '../lib/swarm-data.json';
import senkyokuResultColorJson from '../lib/shu-2021-senkyoku-result-color.json';
import Shu2017GeoSvg from '../lib/shu-2017-geo.svg';

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
    p.item {
        font-size: 0.9rem;
        margin-bottom: 0.45rem;
    }
    span.big {
        font-size: 2rem;
        font-weight: bold;
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

const VisitedSenkyokuMap = () => {
    const senkyokuVisitCounts = Object.fromEntries(swarmDataJson.senkyokuVisitCounts);

    // Manual edit:
    senkyokuVisitCounts['mie-4'] += 1; // 小学生のとき、伊勢、鳥羽など
    senkyokuVisitCounts['wakayama-1'] += 1; // マリーナシティが地図の簡略化により抜けてしまっている
    senkyokuVisitCounts['wakayama-3'] += 1; // 小学生の時、白浜

    const visitedSenkyokuCount = Object.entries<number>(senkyokuVisitCounts).filter(
        ([, count]) => count > 0
    ).length;
    const visitedSenkyokuColors = Object.entries<number>(senkyokuVisitCounts)
        .filter(([, count]) => count > 0)
        .map(([senkyokuId]) => [
            senkyokuId,
            senkyokuResultColorJson[senkyokuId as keyof typeof senkyokuResultColorJson] || 'white',
        ] as [string, string]);
    const visitedSenkyokuColorSet = new Set(
        visitedSenkyokuColors.map(e => e[1])
    );
    const visitedSenkyokuCountsByParty = Array.from(visitedSenkyokuColorSet)
        .map(color => [
            color,
            visitedSenkyokuColors.filter(e => e[1] === color).length,
            Object.entries(senkyokuResultColorJson).filter(([, v]) => v === color).length,
        ] as [string, number, number])
        .sort((a, b) => a[1] === b[1] ? - (a[2] - b[2]) : - (a[1] - b[1]));
    return (
        <MapWrapperDiv>
            <Shu2017GeoSvg />
            <style dangerouslySetInnerHTML={{
                __html: visitedSenkyokuColors
                    .map(([senkyokuId, color]) => `#${senkyokuId}{fill:${color};}`)
                    .join(''),
            }} />
            <CountSection>
                <p>
                    <span className='big'>{visitedSenkyokuCount}</span>
                    <span> / 289</span>
                </p>
                {visitedSenkyokuCountsByParty.map(([color, visitedCount, allCount]) =>
                    <p key={color} className='item'>
                        <Square size='1.4em' fill={color} />
                        {visitedCount} / {allCount}
                    </p>
                )}
            </CountSection>
        </MapWrapperDiv>
    );
};

export default VisitedSenkyokuMap;
