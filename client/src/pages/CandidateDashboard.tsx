import DashboardCard from '../components/DashboardCard';
import Accordion from '../elements/Accordion';

export default function CandidateDashboard(): JSX.Element {
  return (
    <section
      id='candidate-dashboard-section'
      className='px-12 py-6 flex flex-col gap-6'
    >
      {/* personal section */}
      <Accordion title='Personal'>
        <DashboardCard
          title='View Profile'
          description='View and update your personal information and profile.'
          url='/me/candidate-profile'
        />
      </Accordion>

      {/*  work panel */}
      <Accordion title='Task Panel'>
        <DashboardCard
          title='View Progress'
          description='Monitor your application status and task assignments.'
          url='/#'
        />
      </Accordion>
    </section>
  );
}
