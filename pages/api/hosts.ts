import type { NextApiHandler } from 'next';
import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const mackerelApiKey = process.env.MACKEREL_API_KEY!;

const axiosClient = axios.create({
    baseURL: 'https://api.mackerelio.com/',
    headers: {
        'X-Api-Key': mackerelApiKey,
    },
});

const main: NextApiHandler = async (req, res) => {
    const { data } = await axiosClient.get<{hosts: Host[]}>('/api/v0/hosts');
    if (req.method !== 'GET') {
        res.statusCode = 400;
        res.end();
    }
    console.log(data.hosts.filter(host => host.name === 'Kaguya')[0].meta);
    const hosts = data.hosts.map(host => ({
        name: host.name,
        status: host.status,
        memoryUsage: 1 -
            Number(host.meta.memory.free.slice(0, -2))
            / Number(host.meta.memory.total.slice(0, -2)),
        diskUsage: Object.fromEntries(
            Object.entries(host.meta.filesystem).filter(([, v]) =>
                v.mount === '/' || v.mount.match(/^.:$/)
            ).map(([k, v]) => ([k.replace(':', ''), v.kb_used / v.kb_size]))
        ),
    }));
    res.send(hosts);
};

export default main;
