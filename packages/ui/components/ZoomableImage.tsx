import clsx from 'clsx';
import {
    type ComponentPropsWithoutRef,
    startTransition,
    useId,
    useState,
    ViewTransition,
} from 'react';

const showModal = (dialog: HTMLDialogElement) => {
    dialog.showModal();
    return () => dialog.close();
};

const ZoomableImage = (props: ComponentPropsWithoutRef<'img'>) => {
    const name = useId();
    const [aspectRatio, setAspectRatio] = useState<number>();
    const close = () => startTransition(() => setAspectRatio(undefined));

    return (
        <>
            <button
                className='typography-img block cursor-zoom-in'
                onClick={event => {
                    const img = event.currentTarget.querySelector('img');
                    if (!img) return;
                    startTransition(() =>
                        setAspectRatio(img.naturalWidth / img.naturalHeight),
                    );
                }}
                type='button'
            >
                {aspectRatio ? (
                    <img
                        {...props}
                        className={clsx(props.className, 'invisible')}
                    />
                ) : (
                    <ViewTransition name={name}>
                        <img {...props} />
                    </ViewTransition>
                )}
            </button>
            {aspectRatio && (
                <dialog
                    className='m-0 flex size-full max-h-none max-w-none cursor-zoom-out items-center justify-center bg-transparent backdrop:bg-black/80'
                    onCancel={event => {
                        event.preventDefault();
                        close();
                    }}
                    onClick={close}
                    ref={showModal}
                >
                    <ViewTransition name={name}>
                        <img
                            alt={props.alt}
                            src={props.src}
                            style={{
                                width: `min(100dvw, 100dvh * ${aspectRatio})`,
                            }}
                        />
                    </ViewTransition>
                </dialog>
            )}
        </>
    );
};

export default ZoomableImage;
