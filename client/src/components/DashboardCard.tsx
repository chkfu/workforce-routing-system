export default function DashboardCard({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}): JSX.Element {
  return (
    <div className='dashboard-card shadow-lg w-80 p-8 cursor-pointer transform hover:brightness-0 active:scale-98 transition-all duration-600'>
      <a href={url}>
        <h4 className='p-2 font-bold text-lg text-gray-700'>{title}</h4>
        <p className='p-2 text-gray-600 italic text-justify'>{description}</p>
      </a>
    </div>
  );
}
