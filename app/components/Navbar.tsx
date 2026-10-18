import { Link } from 'react-router';

const Navbar = () => (
    <div className='navbar px-0'>
        <div className='navbar-start'>
            <Link className='font-bold text-xl' to='/'>
                hideo54.com
            </Link>
        </div>
    </div>
);

export default Navbar;
