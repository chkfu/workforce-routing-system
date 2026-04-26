import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className='layout flex flex-col min-h-screen'>
      <Header />
      <main
        id='main-content'
        className='w-full flex-1 p-8'
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
