import { useRoutes, RouteObject } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './components/Layout';
import Login from './pages/Login';
import Error from './pages/Error';
import ManageCandidates from './pages/CandidateProfile';
import ManageDepartments from './pages/ManageDepartments';
import CandidateProfile from './pages/CandidateProfile';
import CandidateDashboard from './pages/CandidateDashboard';
import AssistantDashboard from './pages/AssistantDashboard';
import ManagerDashboard from './pages/ManagerDashboard';

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: <Layout />,
    children: [
      //  Public Access
      {
        path: '/',
        element: <Home />,
      },
      //  Group List, by permissions
      {
        path: '/manage-candidates',
        element: <ManageCandidates />,
      },
      {
        path: '/manage-departments',
        element: <ManageDepartments />,
      },
      //  Dashboards, by role positions
      {
        path: '/candidate-dashboard',
        element: <CandidateDashboard />,
      },
      {
        path: '/assistant-dashboard',
        element: <AssistantDashboard />,
      },
      {
        path: '/manager-dashboard',
        element: <ManagerDashboard />,
      },
      //  Profiles, by role positions
      {
        path: '/me/candidate-profile',
        element: <CandidateProfile />,
      },
    ],
  },
  {
    path: '*',
    element: <Error />,
  },
];

export default function App() {
  return useRoutes(routes);
}
