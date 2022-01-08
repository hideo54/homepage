import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs/promises';
import { Storage } from '@google-cloud/storage';
import dayjs from 'dayjs';

const url = 'https://github.com/hideo54';

const css = `
    <style>
        rect[data-level="0"] { fill: #ebedf0; }
        rect[data-level="1"] { fill: #9be9a8; }
        rect[data-level="2"] { fill: #40c463; }
        rect[data-level="3"] { fill: #30a14e; }
        rect[data-level="4"] { fill: #216e39; }

        @media (prefers-color-scheme: dark) {
            rect[data-level="0"] { fill: #161b22; }
            rect[data-level="1"] { fill: #0e4429; }
            rect[data-level="2"] { fill: #006d32; }
            rect[data-level="3"] { fill: #26a641; }
            rect[data-level="4"] { fill: #39d353; }
        }
    </style>
`;

const saveGrassSvg = async () => {
    const html = (await axios.get(url)).data;
    const $ = cheerio.load(html);
    $('text').remove();
    const svgInnerHtml = $('svg.js-calendar-graph-svg').children().html();
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="14 0 686 88">${svgInnerHtml?.trim()}${css}</svg>`;
    const date = dayjs().format('YYYY-MM-DD');
    await fs.writeFile(`${date}.svg`, svgStr);
    if (process.env.NODE_ENV === 'development') {
        const storage = new Storage({ keyFilename: 'key.json' });
        await storage.bucket('img.hideo54.com').upload(`${date}.svg`, {
            destination: 'github-grass',
            public: true,
        });
    }
};

saveGrassSvg();
