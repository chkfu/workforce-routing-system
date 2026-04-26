import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className='layout flex flex-col min-h-screen'>
      <Header />
      <main
        id='main-content'
        className='w-full flex-1 p-4 md:p-8 max-w-full lg:max-w-2/3 mx-auto transition-all duration-600 ease-in-out'
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
