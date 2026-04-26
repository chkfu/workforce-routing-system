import { useRoutes, RouteObject } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './components/Layout';
import Login from './pages/Login';
import Error from './pages/Error';
import ManageCandidates from './pages/CandidateProfile';
import ManageDepartments from './pages/ManageDepartments';
import CandidateProfile from './pages/CandidateProfile';

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/manage-candidates',
        element: <ManageCandidates />,
      },
      {
        path: '/manage-departments',
        element: <ManageDepartments />,
      },
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
