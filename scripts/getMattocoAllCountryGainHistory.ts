import fs from 'fs/promises';
import axios from 'axios';
import dayjs from 'dayjs';

// Hard coded because...
// * mattoco has severe login system which often requires email 2FA
// * The number of shares held does (and should!) merely change
const hold_from = '20240701';
const n_hold = 113_533;

const main = async () => {
    const { data } = await axios.get<{
        ROWS: {
            BASE_DATE: string;
            BASE_PRICE: number;
        }[];
    }>('https://direct.mattoco.jp/chartdata/chart_data_renewal_253425.js');
    const priceHistoryAfterHold = data.ROWS.filter(row => row.BASE_DATE >= hold_from);
    const priceWhenHold = priceHistoryAfterHold[0].BASE_PRICE;
    const gainHistoryAfterHold = priceHistoryAfterHold.slice(1).map(row => ({
        date: dayjs(row.BASE_DATE, 'YYYYMMDD').format('YYYY-MM-DD'),
        gain: (row.BASE_PRICE - priceWhenHold) * n_hold / 10_000,
    }));
    await fs.writeFile('lib/mattoco-all-country-gain-history.json', JSON.stringify(gainHistoryAfterHold));
};

main();
