import clsx from 'clsx';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import mattocoAllCountryGainHistory from '../lib/mattoco-all-country-gain-history.json';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const AllCountryGainPlot: React.FC<{
    lineColor: string;
}> = ({ lineColor }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        if (!window) return;
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            if (!isDarkMode) {
                setIsDarkMode(true);
            }
        }
        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', e => {
                setIsDarkMode(e.matches);
            });
    }, []);
    return (
        <Plot
            config={{
                staticPlot: true,
            }}
            data={[
                {
                    line: {
                        color: lineColor,
                    },
                    mode: 'lines',
                    type: 'scatter',
                    x: mattocoAllCountryGainHistory.map(data =>
                        dayjs(data.date).format('YYYY-MM-DD'),
                    ),
                    y: mattocoAllCountryGainHistory.map(data => data.gain),
                },
            ]}
            layout={{
                autosize: true,
                font: {
                    color: isDarkMode ? '#ffffff' : '#171717', // neutral-900
                },
                margin: {
                    b: 60,
                    l: 60,
                    r: 0,
                    t: 0,
                },
                paper_bgcolor: isDarkMode ? '#000000' : '#ffffff',
                plot_bgcolor: isDarkMode ? '#000000' : '#ffffff',
                showlegend: false,
                xaxis: {
                    tickformat: '%Y-%m-%d',
                },
                yaxis: {
                    gridcolor: isDarkMode ? '#404040' : '#d4d4d4', // neutral-700, neutral-400
                    tickformat: ',d',
                    tickprefix: '¥',
                    zerolinecolor: isDarkMode ? '#ffffff' : '#000000', // neutral-700, neutral-400
                },
            }}
            style={{
                width: '100%',
            }}
            useResizeHandler
        />
    );
};

const App = () => {
    const latestGain =
        mattocoAllCountryGainHistory[mattocoAllCountryGainHistory.length - 1]
            .gain;
    const latestDate = dayjs(
        mattocoAllCountryGainHistory[mattocoAllCountryGainHistory.length - 1]
            .date,
    );
    return (
        <Layout title='投資成功状況 | hideo54.com'>
            <h1>投資成功状況</h1>
            <p className='text-sm'>
                最終更新: {latestDate.format('YYYY年M月D日')}
            </p>
            <section>
                <div
                    className={clsx([
                        'font-extrabold text-4xl',
                        latestGain >= 0 ? 'text-green-600' : 'text-red-600',
                    ])}
                >
                    ¥
                    {latestGain.toLocaleString('ja-JP', {
                        maximumFractionDigits: 0,
                    })}
                </div>
                <div className='mb-8 h-[450px]'>
                    <AllCountryGainPlot
                        lineColor={latestGain >= 0 ? '#16a34a' : '#dc2626'}
                    />
                </div>
                {latestGain < 0 && (
                    <p>人のことを「靴磨きの少年」と呼ぶのやめてください</p>
                )}
            </section>
        </Layout>
    );
};

export default App;
