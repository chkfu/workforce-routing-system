interface ButtonConfirmProps {
  label: string;
  onClick: () => void;
}

export default function ButtonConfirm({ label, onClick }: ButtonConfirmProps): JSX.Element {
  return (
    <button
      className='px-6 py-3 rounded-2xl bg-yellow-500 font-semibold text-lg cursor-pointer hover:brightness-125 active:scale-[0.98] transition-all duration-900 font-sans text-gray-800'
      onClick={onClick}
    >
      {label}
    </button>
  );
}
