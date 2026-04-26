import ButtonConfirm from '../elements/ButtonConfirm';
import { useNavigate } from 'react-router-dom';
import PageNotFound from '../assets/svg/page-not-found.svg';
import { useEffect, useState } from 'react';

export default function Error(): JSX.Element {
  //  setup timeout redirection
  const navigate = useNavigate();
  const [count, setCount] = useState(10);
  useEffect(() => {
    if (count < 1) {
      navigate('/');
    } else {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [count, navigate]); // leanrt: rmb to put dependencies to trigger re-render

  //  visualisation
  return (
    <div
      id='error_container'
      className='flex items-center justify-center min-h-screen'
    >
      {/*  Redirecting Section */}
      <div className='absolute top-48 text-xl '>
        <p className='font-mono text-gray-800'>
          Redirecting to homepage in {count} seconds...
        </p>
      </div>
      <div className='flex items-center gap-16 w-full max-w-5xl px-4'>
        {/*  Logo Box */}
        <img
          src={PageNotFound}
          alt='Page not found'
          className='w-72 h-90'
        />
        {/* Text Box */}
        <div className='text-left flex-1 font-san'>
          <h2 className='text-5xl font-bold mb-4  text-teal-900'>
            404 NOT FOUND
          </h2>
          <h4 className='text-xl text-gray-800 mb-12'>
            The page you're looking for doesn't exist.
          </h4>
          <ButtonConfirm
            label='Back Home'
            onClick={() => navigate('/')}
          />
        </div>
      </div>
    </div>
  );
}
