import fs from 'fs/promises';
import axios from 'axios';
import dayjs from 'dayjs';

// Hard coded because...
// * mattoco has severe login system which often requires email 2FA
// * The number of shares held does (and should!) merely change
const holdHistory = {
    '20240617': 78_046,
    '20240624': 0,
    '20240701': 113_533,
};

const main = async () => {
    const { data } = await axios.get<{
        ROWS: {
            BASE_DATE: string;
            BASE_PRICE: number;
        }[];
    }>('https://direct.mattoco.jp/chartdata/chart_data_renewal_253425.js');
    const holdFrom = Object.keys(holdHistory).sort()[0];
    const priceHistoryAfterHold = data.ROWS.filter(row => row.BASE_DATE >= holdFrom);
    const gainHistory = priceHistoryAfterHold.slice(1).reduce((acc, cur, i) => {
        const newObj = {
            date: dayjs(cur.BASE_DATE, 'YYYYMMDD').format('YYYY-MM-DD'),
            gain: acc[acc.length - 1].gain
                + (priceHistoryAfterHold[i + 1].BASE_PRICE - priceHistoryAfterHold[i].BASE_PRICE)
                * Object.entries(holdHistory).findLast(([date]) => date < cur.BASE_DATE)![1] / 10_000,
        };
        return [...acc, newObj];
    }, [{
        date: dayjs(priceHistoryAfterHold[0].BASE_DATE, 'YYYYMMDD').format('YYYY-MM-DD'),
        gain: 0,
    }]);
    await fs.writeFile('lib/mattoco-all-country-gain-history.json', JSON.stringify(gainHistory));
};

main();
