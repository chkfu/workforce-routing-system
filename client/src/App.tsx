import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Departments from './pages/Departments';
import Staff from './pages/Staff';
import StaffProfile from './pages/StaffProfile';
import Candidates from './pages/Candidates';
import CandidateProfile from './pages/CandidateProfile';
import Selection from './pages/Selection';
import Probation from './pages/Probation';
import Hiring from './pages/Hiring';
import FinalIntakes from './pages/FinalIntakes';
import Error from './pages/Error';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/login'
          element={<Login />}
        />
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/departments'
          element={<Departments />}
        />
        <Route
          path='/staff'
          element={<Staff />}
        />
        <Route
          path='/staff-profile'
          element={<StaffProfile />}
        />
        <Route
          path='/candidates'
          element={<Candidates />}
        />
        <Route
          path='/candidate-profile'
          element={<CandidateProfile />}
        />
        <Route
          path='/selection'
          element={<Selection />}
        />
        <Route
          path='/probation'
          element={<Probation />}
        />
        <Route
          path='/hiring'
          element={<Hiring />}
        />
        <Route
          path='/final-intakes'
          element={<FinalIntakes />}
        />
        <Route
          path='*'
          element={<Error />}
        />
      </Routes>
    </BrowserRouter>
  );
}
