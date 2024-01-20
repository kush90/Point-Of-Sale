import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';


import AuthGuard from './AuthHOC';
import './App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Error from './pages/Error';
import Main from './layouts/Main';
import Setting from './pages/Setting';
import Order from './pages/Order';
import User from './pages/User';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<AuthGuard Component={Main} />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard/setting" element={<Setting/>}/>
          <Route path="/dashboard/order" element={<Order/>}/>"
          <Route path="/dashboard/user" element={<User/>}/>"
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
