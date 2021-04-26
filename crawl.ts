import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs/promises';
import { Storage } from '@google-cloud/storage';
import dayjs from 'dayjs';

const url = 'https://github.com/hideo54';

const saveGrassSvg = async () => {
    const html = (await axios.get(url)).data;
    const $ = cheerio.load(html);
    const svgInnerHtml = $('svg.js-calendar-graph-svg').html();
    const svgStr = `<svg  xmlns="http://www.w3.org/2000/svg" width="772" height="112">${svgInnerHtml}</svg>`
    const date = dayjs().format('YYYY-MM-DD');
    await fs.writeFile(`${date}.svg`, svgStr);
    if (process.env.NODE_ENV === 'development') {
        const storage = new Storage({keyFilename: 'key.json'});
        await storage.bucket('img.hideo54.com').upload(`${date}.svg`, {
            destination: 'github-grass',
            public: true,
        });
    }
};

saveGrassSvg();
