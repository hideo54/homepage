const Map: React.FC<{
    Svg: React.FC<{ viewBox?: string; id: string; className: string; }>;
    viewBox: string;
    idProvidedByClass?: boolean;
    fill: {[keys: string]: string};
    count: number;
    maxCount?: number;
    CountSectionChildren?: React.ReactNode;
    id: string;
    additionalCss?: string;
}> = props => (
    <div className='not-prose dark:prose relative bg-[#a5c1fa]'>
        <props.Svg viewBox={props.viewBox} id={props.id} className='w-full max-h-[120vw] fill-white stroke-black stroke-[0.2px]' />
        <style dangerouslySetInnerHTML={{
            __html: (props.additionalCss || '') + Object.entries(props.fill)
                .map(([prefId, color]) =>
                    `#${props.id} path${props.idProvidedByClass ? '.' : '#'}${prefId}{fill:${color};}`
                ).join(''),
        }} />
        <section className='absolute top-0 p-2'>
            <p>
                <span className='text-3xl font-bold'>{props.count}</span>
                {props.maxCount &&
                    <span> / {props.maxCount}</span>
                }
            </p>
            {props.CountSectionChildren}
        </section>
    </div>
);

export default Map;
