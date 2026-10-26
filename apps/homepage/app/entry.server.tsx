import { renderToReadableStream } from 'react-dom/server';
import { type EntryContext, ServerRouter } from 'react-router';

// prerender 専用なので、bot 判定はせず常に全体の描画完了を待つ
const handleRequest = async (
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    routerContext: EntryContext,
) => {
    const body = await renderToReadableStream(
        <ServerRouter context={routerContext} url={request.url} />,
        {
            onError: (error: unknown) => {
                responseStatusCode = 500;
                console.error(error);
            },
        },
    );
    await body.allReady;
    responseHeaders.set('Content-Type', 'text/html');
    return new Response(body, {
        headers: responseHeaders,
        status: responseStatusCode,
    });
};

export default handleRequest;
