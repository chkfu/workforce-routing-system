import DashboardCard from '../components/DashboardCard';
import Accordion from '../elements/Accordion';
import { TCardItem } from '../utils/types/element_types';

//  Declaration

const card_list_personal: TCardItem[] = [
  {
    title: 'View Profile',
    description: 'View and update your personal information and profile.',
    path: '/me/staff-profile',
  },
];

const card_list_task_panel: TCardItem[] = [
  {
    title: 'Manage Candidates',
    description: 'Review and manage candidate applications and profiles',
    path: '/manage-candidates',
  },
  {
    title: 'Manage Staff',
    description: 'Manage staff members and their assignments',
    path: '/manage-staff',
  },
  {
    title: 'Manage Departments',
    description: 'Organize and manage department information',
    path: '/manage-departments',
  },
  {
    title: 'Assign Tasks',
    description: 'Create and assign tasks to team members',
    path: '/#',
  },
];

//  Function

export default function ManagerDashboard(): JSX.Element {
  //  visualise
  return (
    <section
      id='manager-dashboard-section'
      className='px-12 py-6 flex flex-col gap-6'
    >
      {/* personal section */}
      {card_list_personal.map((el: TCardItem) => {
        return (
          <Accordion title='Personal'>
            <DashboardCard
              title={el.title}
              description={el.description}
              url={el.path}
            />
          </Accordion>
        );
      })}

      {/*  work panel */}
      {card_list_task_panel.map((el: TCardItem) => {
        return (
          <Accordion title='Task Panel'>
            <DashboardCard
              title={el.title}
              description={el.description}
              url={el.path}
            />
          </Accordion>
        );
      })}
    </section>
  );
}
