import React, { useEffect } from 'react'
import { Route,Routes,Navigate} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Setting from './pages/Setting';
import Profile from './pages/Profile';
import { axiosInstance } from './lib/axios';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useAuthstore } from './store/useAuthstore';
import { useThemestore } from './store/useTheme';

function App() {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers} = useAuthstore();

  useEffect(()=>{
    checkAuth()
  },[checkAuth]);

  const {theme}=useThemestore();
  if(isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin"/>
    </div>
  );

  return (
    <div data-theme={theme}>
     <Navbar/>
     <Routes>
        <Route path="/" element={authUser ? <Home/> : <Navigate to="/Login"/>}/>
        <Route path="/signup" element={!authUser ?  <Signup/> : <Navigate to="/"/>}/>
        <Route path="/Login" element={!authUser  ?  <Login/> : <Navigate to="/"/> }/>
        <Route path="/setting" element={authUser ?  <Setting/> : <Navigate to="/Login"/>}/>
        <Route path="/profile" element={authUser ?  <Profile/> : <Navigate to="/Login"/>}/>
     </Routes>
     <Toaster/>
    </div>
  )
}

export default App
