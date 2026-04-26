import logo_atrium from '../assets/svg/atrium-logo.svg';
import logo_login from '../assets/svg/user-icon.svg';

type TNavItem = { label: string; href: string };

export default function Header() {
  const list_nav_items: TNavItem[] = [
    { label: 'Services', href: '/services' },
    { label: 'Project', href: '/project' },
    { label: 'Careers', href: '/careers' },
    { label: 'User Guide', href: '/user-guide' },
  ];

  return (
    <header className='sticky top-0 z-50'>
      <nav className='bg-teal-800/85 border-b border-gray-200 shadow-sm w-full pt-2 relative'>
        {/* Absolute -  Login Button */}
        <a
          href='/login'
          className='absolute right-8 top-8 transform px-4 w-32 h-10 rounded-3xl bg-slate-300 flex items-center justify-left cursor-pointer hover:bg-slate-100 hover:text-teal-800 transition duration-500 active:scale-95'
        >
          <img
            src={logo_login}
            alt='User'
            width='24'
            height='24'
            className='text-teal-800'
          />
          <span className='px-4 text-lg text-teal-800'>Login</span>
        </a>
        {/*  Relative - Main Navigation */}
        <div className='flex items-center justify-center'>
          {/* Static - Large Logo Banner */}
          <a className='flex active:scale-98 justify-center items-center p-4 cursor-pointer'>
            <img
              src={logo_atrium}
              alt='Atrium'
              width='64'
              height='64'
            />
            <h1 className='text-4xl font-bold text-slate-200 font-serif px-2 hover:text-white transition duration-900'>
              Atrium
            </h1>
          </a>
        </div>
        {/* Static - Nav Items Container */}
        <div className='flex items-center justify-center'>
          <ul className='flex justify-center h-12'>
            {list_nav_items.map((item: TNavItem) => (
              <li
                key={item.label}
                className='flex items-center px-8 py-4 text-xl text-slate-300 font-serif font-bold cursor-pointer hover:border-b-6 hover:border-teal-700 transition duration-900'
              >
                <a
                  href={item.href}
                  className='inline-block hover:brightness-200 hover:text-white transition duration-900 active:scale-90'
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
