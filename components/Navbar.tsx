import Link from 'next/link';

const Navbar = () => (
    <div className='navbar px-0'>
        <div className='navbar-start'>
            <Link className='font-bold text-xl' href='/'>
                hideo54.com
            </Link>
        </div>
    </div>
);

export default Navbar;
