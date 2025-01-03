import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import clsx from 'clsx';
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
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            setIsDarkMode(e.matches);
        });
    }, []);
    return (
        <Plot
            data={[
                {
                    x: mattocoAllCountryGainHistory.map(data => dayjs(data.date).format('YYYY-MM-DD')),
                    y: mattocoAllCountryGainHistory.map(data => data.gain),
                    type: 'scatter',
                    mode: 'lines',
                    line: {
                        color: lineColor,
                    },
                },
            ]}
            layout={{
                margin: {
                    t: 0,
                    b: 60,
                    l: 60,
                    r: 0,
                },
                autosize: true,
                xaxis: {
                    tickformat: '%Y-%m-%d',
                },
                showlegend: false,
                font: {
                    color: isDarkMode ? '#ffffff' : '#171717', // neutral-900
                },
                paper_bgcolor: isDarkMode ? '#000000' : '#ffffff',
                plot_bgcolor: isDarkMode ? '#000000' : '#ffffff',
                yaxis: {
                    gridcolor: isDarkMode ? '#404040' : '#d4d4d4', // neutral-700, neutral-400
                    tickformat: ',d',
                    tickprefix: '¥',
                    zerolinecolor: isDarkMode ? '#ffffff' : '#000000', // neutral-700, neutral-400
                },
            }}
            config={{
                staticPlot: true,
            }}
            useResizeHandler
            style={{
                width: '100%',
            }}
        />
    );
};

const App = () => {
    const latestGain = mattocoAllCountryGainHistory[mattocoAllCountryGainHistory.length - 1].gain;
    const latestDate = dayjs(mattocoAllCountryGainHistory[mattocoAllCountryGainHistory.length - 1].date);
    return (
        <Layout
            title='投資成功状況 | hideo54.com'
        >
            <h1>投資成功状況</h1>
            <p className='text-sm'>
                最終更新: {latestDate.format('YYYY年M月D日')}
            </p>
            <section>
                <div className={clsx([
                    'text-4xl font-extrabold',
                    latestGain >= 0 ? 'text-green-600' : 'text-red-600',
                ])}>
                    ¥{latestGain.toLocaleString('ja-JP', {
                        maximumFractionDigits: 0,
                    })}
                </div>
                <div className='mb-8 h-[450px]'>
                    <AllCountryGainPlot lineColor={latestGain >= 0 ? '#16a34a' : '#dc2626'} />
                </div>
                {latestGain < 0 && (
                    <p>
                        人のことを「靴磨きの少年」と呼ぶのやめてください
                    </p>
                )}
            </section>
        </Layout>
    );
};

export default App;
