import { useState } from 'react'
import './App.css'
import UserProfiles from './components/UserProfiles'
import Signup from './pages/Signup';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import AnimationAlert from './components/AnimationAlert';
import PrivateRoute from './components/PrivateRoutes';
import PuiblicRoute from './components/PublicRoute';
import AfterSignup from './pages/AfterSignup';
import Users from './pages/Users';
import Login from './pages/Login';
import MyNavbar from './components/Navbar';
import FriendRequest from './pages/FriendRequest';
import Friends from './pages/Friends';
import UserProfile from './pages/UserProfile';
import Chats from './pages/Chats';

function AppContent() {

  const location = useLocation();

  return (
    <>
      <AnimationAlert />
      {!['/login', '/signup'].includes(location.pathname) ? (
        <div>
          <MyNavbar />
          <div className='app container-fluid'>
            <Routes>
              <Route path='/' element={<PrivateRoute><Users /></PrivateRoute>} />
              <Route path='/onBoard' element={<PrivateRoute><AfterSignup /></PrivateRoute>} />
              <Route path='/users' element={<PrivateRoute><Users /></PrivateRoute>} />
              <Route path='/friend-requets' element={<PrivateRoute><FriendRequest/></PrivateRoute>} />
              <Route path='/friends' element={<PrivateRoute><Friends/></PrivateRoute>} />
              <Route path='/friends' element={<PrivateRoute><Friends/></PrivateRoute>} />
              <Route path='/chats' element={<PrivateRoute><Chats/></PrivateRoute>} />
            </Routes>

          </div>
        </div>
      ) : (
        <Routes>
          <Route path='/signup' element={<PuiblicRoute><Signup /></PuiblicRoute>} />
          <Route path='/login' element={<PuiblicRoute><Login /></PuiblicRoute>} />
        </Routes>
      )}

    </>

  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}


export default App
