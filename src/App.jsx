import { useEffect, useState } from 'react'
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
import {initSocket} from './socket/socket'
import ExampleModal from './components/DeleteModal';
import FileUploadModal from './components/FileUploadModal';
import { useSelector } from 'react-redux';
import { initSocketListeners } from './socket/socketListeners';
import VideoRoom from './pages/VideoRoom';

function AppContent() {
  const user = useSelector(state=> state.auth.user);

  const location = useLocation();
  useEffect(()=>{
    initSocket();
  },[]);


  useEffect(()=>{
    if(user?._id){
      initSocketListeners(user._id)
    }
  },[user?._id])

  return (
    <>
      <AnimationAlert />
      <ExampleModal/>
      {!['/login', '/signup',''].includes(location.pathname) ? (
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
          <Route path='/video/:roomId' element={<PrivateRoute><VideoRoom/></PrivateRoute>} />
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
