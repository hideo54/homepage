import { IoChevronBack } from 'react-icons/io5';
import { IconLink } from './iconTools';

const Navbar = () => (
    <div className='relative mx-4 mt-2 -mb-2 max-w-(--breakpoint-lg) transition hover:underline'>
        <IconLink LeftIcon={IoChevronBack} to='/'>
            hideo54.com
        </IconLink>
    </div>
);

export default Navbar;
