const immutable = 'public, max-age=31536000, immutable';

const resolve = async (bucket: R2Bucket, key: string) => {
    if (key === 'icons/real') {
        const { objects } = await bucket.list({ prefix: 'icons/real-' });
        const latest = objects
            .map(object => object.key)
            .filter(key => /^icons\/real-\d{8}\.webp$/.test(key))
            .sort()
            .at(-1);
        return latest && { cacheControl: 'public, max-age=3600', key: latest };
    }
    if (/^icons\/real-\d{8}$/.test(key)) {
        return { cacheControl: immutable, key: `${key}.webp` };
    }
    return { cacheControl: undefined, key };
};

export default {
    async fetch(request, env, ctx) {
        if (request.method !== 'GET' && request.method !== 'HEAD') {
            return new Response(null, {
                headers: { Allow: 'GET, HEAD' },
                status: 405,
            });
        }
        const url = new URL(request.url);
        const cacheKey = new Request(url.origin + url.pathname, {
            method: 'GET',
        });
        const cache = caches.default;
        let response = await cache.match(cacheKey);
        if (!response) {
            const resolved = await resolve(
                env.IMG,
                decodeURIComponent(url.pathname.slice(1)),
            );
            const object = resolved && (await env.IMG.get(resolved.key));
            if (!object) return new Response('Not Found', { status: 404 });
            const headers = new Headers();
            object.writeHttpMetadata(headers);
            headers.set('ETag', object.httpEtag);
            if (resolved.cacheControl) {
                headers.set('Cache-Control', resolved.cacheControl);
            } else if (!headers.has('Cache-Control')) {
                headers.set('Cache-Control', 'public, max-age=86400');
            }
            response = new Response(object.body, { headers });
            ctx.waitUntil(cache.put(cacheKey, response.clone()));
        }
        return request.method === 'HEAD'
            ? new Response(null, response)
            : response;
    },
} satisfies ExportedHandler<Env>;
