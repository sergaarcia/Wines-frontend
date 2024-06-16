import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddWine from './components/AddWine';
import AddFollower from './components/AddFollower';
import Unfollow from './components/Unfollow';
import AddUser from './components/AddUser';
import RemoveUser from './components/RemoveUser';
import RemoveWine from './components/RemoveWine';
import { ServiceGroupIdProvider } from './components/ServiceGroupIdContext';

const App = () => {
  return (
    <ServiceGroupIdProvider>
      <Router>
        <div>
          <h1>Wine Social Network</h1>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-wine" element={<AddWine />} />
            <Route path="/add-follower" element={<AddFollower />} />
            <Route path="/unfollow" element={<Unfollow />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/remove-user" element={<RemoveUser />} />
            <Route path="/remove-wine" element={<RemoveWine />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </ServiceGroupIdProvider>
  );
};

export default App;
