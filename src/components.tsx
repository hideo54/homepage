import path from 'path';
import { RoundImage } from './styles';

interface LocalImageProps {
    src: string;
    alt?: string;
    width?: string;
    height?: string;
    isRounded?: boolean;
}

export const LocalImage = (props: LocalImageProps) => {
    const name = path.parse(props.src).name;
    if (props.isRounded !== true) { // undefined (default) or false
        return <img
            src={props.src}
            alt={props.alt ? props.alt : name}
            width={props.width}
            height={props.height}
        />;
    } else {
        return <RoundImage
            src={props.src}
            alt={props.alt ? props.alt : name}
            width={props.width}
            height={props.height}
        />;
    }
};