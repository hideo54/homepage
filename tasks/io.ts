import fs from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const generatedDir = path.join(__dirname, '../data/generated');
const cacheDir = path.join(__dirname, '.cache');

/** data/geo などの読み取り専用素材へのパスを解決する。 */
export const dataPath = (...segments: string[]) =>
    path.join(__dirname, '../data', ...segments);

/** スクレイピング結果を data/generated/<name>.json に書き出す。 */
export const writeGenerated = async (name: string, data: unknown) => {
    await fs.mkdir(generatedDir, { recursive: true });
    const filename = path.join(generatedDir, `${name}.json`);
    await fs.writeFile(filename, JSON.stringify(data));
    console.log(`Wrote ${path.relative(process.cwd(), filename)}`);
};

/**
 * tasks/.cache/<name>.json にキャッシュされた値を返す。
 * なければ fetch を実行し、その結果をキャッシュしてから返す。
 */
export const withCache = async <T>(
    name: string,
    fetch: () => Promise<T>,
): Promise<T> => {
    const filename = path.join(cacheDir, `${name}.json`);
    try {
        const cached = await fs.readFile(filename, 'utf-8');
        console.log(`Cache found at ${name}.json. Fetch skipped.`);
        return JSON.parse(cached) as T;
    } catch {
        const fetched = await fetch();
        await fs.mkdir(cacheDir, { recursive: true });
        await fs.writeFile(filename, JSON.stringify(fetched), 'utf-8');
        return fetched;
    }
};
