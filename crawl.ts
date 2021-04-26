import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs/promises';
import { Storage } from '@google-cloud/storage';
import dayjs from 'dayjs';

const url = 'https://github.com/hideo54';

const saveGrassSvg = async () => {
    const html = (await axios.get(url)).data;
    const $ = cheerio.load(html);
    const svg = $('svg.js-calendar-graph-svg');
    const svgStr = $.html(svg);
    await fs.writeFile('tmp.svg', svgStr);
    if (process.env.NODE_ENV === 'development') {
        const storage = new Storage({keyFilename: 'key.json'});
        const filename = dayjs().format('YYYY-MM-DD');
        await storage.bucket('img.hideo54.com').upload('tmp.svg', {
            destination: `github-grass/${filename}.svg`,
            public: true,
        });
    }
};

saveGrassSvg();
