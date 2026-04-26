import React from 'react';

export default function Accordion({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}): React.ReactNode {
  return (
    <div className='rounded-lg'>
      <button className='accordion text-teal-800 border-b border-teal-800 w-1/2 p-2 font-bold font-serif text-2xl cursor-pointer hover:brightness-75 transition-all duration-700 text-left'>
        {title}
      </button>
      <div className='panel flex flex-wrap gap-4 p-2 overflow-hidden'>
        {children}
      </div>
    </div>
  );
}
