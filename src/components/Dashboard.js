import React, { useEffect, useState } from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { Routes, Route, useNavigate,Navigate } from 'react-router-dom';

import Home from "./home/Home"
import Logout from './Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import LayersIcon from '@mui/icons-material/Layers';
import SettingsIcon from '@mui/icons-material/Settings';
import AnalyticsIcon from '@mui/icons-material/BarChart';
import { Analytics } from './Analytics';
import logo from '../assets/logo.webp';


const BRANDING = {
  title: 'Shuddhi Netra',
  logo: (
    <img
      src={logo}
      alt="Shuddinetra logo"
      style={{ height: 30 ,alignContent:'center' ,paddingTop:9}}
    />
  ),
 
};




export default function DashboardLayoutBasic({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    localStorage.removeItem('user'); // Clear persisted data
    navigate('/login'); 
  };
  
  const [userData,setUser]=useState(()=>localStorage.getItem('user'))
  useEffect(()=>{
    setUser(()=>localStorage.getItem('user'))
    console.log("userData",userData);
    
  },[])
  
//Dashbord components
// const Home = () => <div><h2>Home Content </h2> <h4 >Welcome, {user?.username || 'Guest'}</h4> </div>;
const Integrations = () => <h2>Integrations Content</h2>;
const Settings = () => <h2>Settings Content</h2>;


  const NAVIGATION = [
    { kind: 'header', title: 'Main items' },
    { segment: 'home', title: 'Home', icon: <DashboardIcon />, action: () => navigate('/home') },
    { segment: 'integrations', title: 'Integrations', icon: <LayersIcon />, action: () => navigate('/integrations') },
    { segment: 'analytics', title: 'Analytics', icon: <AnalyticsIcon />, action: () => navigate('/analytics') },
    { segment: 'settings', title: 'Settings', icon: <SettingsIcon />, action: () => navigate('/settings') },
    { kind: 'header', title: `Welcome, ${user?.username || 'Guest'}` },
    {
      segment: 'logout',
      title: 'Logout',
      icon: <LogoutIcon />,
      action: handleLogout,
    },
  ];

  return (
    <AppProvider
    branding={BRANDING}
      navigation={NAVIGATION}
      renderLogo={() => (
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
          <img src="logo" alt="Custom Logo" style={{ height: 40, marginRight: 10 }} />
          <h3 style={{ margin: 0 }}>My Custom App</h3>
        </div>
      )}
    >
      <DashboardLayout>
        <PageContainer>
          <Routes>
            <Route path="/home" element={<Home user={user}/>} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
          </Routes>
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
