import React, { useEffect, useState } from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

import Home from "./home/Home"
import Logout from './Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import LayersIcon from '@mui/icons-material/Layers';
import SettingsIcon from '@mui/icons-material/Settings';
import AnalyticsIcon from '@mui/icons-material/BarChart';
import { Analytics } from './analytics/Analytics';
import logo from '../assets/logo.webp';
import WasteManagement from './wastemanagement/WasteManagement'
import Typography from '@mui/material/Typography';
import { Container, Grid2 } from '@mui/material';
import EventManagement from './events/EventManagement';

const BRANDING = {
  title: 'Shuddhi Netra',
  logo: (
    <img
      src={logo}
      alt="Shuddinetra logo"
      style={{ height: 30, alignContent: 'center', paddingTop: 9 }}
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

  const [userData, setUser] = useState(() => localStorage.getItem('user'))
  useEffect(() => {
    setUser(() => localStorage.getItem('user'))
    console.log("userData", userData);

  }, [])

  
  const Settings = () => <h2>Settings Content</h2>;


  const NAVIGATION = [
    { kind: 'header', title: 'Main items' },
    { segment: 'home', title: 'Home', icon: <DashboardIcon />, action: () => navigate('/home') },
    { segment: 'eventmanagement', title: 'Event Management', icon: <LayersIcon />, action: () => navigate('/eventmanagement') },
    { segment: 'wastemanagement', title: 'Waste Management', icon: <LayersIcon />, action: () => navigate('/wastemanagement') },
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


  const WecomeToolAction=()=> {
     const defaultActions = DashboardLayout.defaultProps?.slots?.toolbarActions || [];
    return (

        <h5>Welcome, {user?.username?.toUpperCase() +'\n'+ user.pincode || 'Guest'}</h5>
       
      
    );
  };

  function SidebarFooter({ mini }) {
    return (
      <Typography
        variant="caption"
        sx={{ m: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}
      >
        {`© ${new Date().getFullYear()} Reserved by Team Terminatiors`}
      </Typography>
    );
  }



  return (
    <AppProvider
      branding={BRANDING}
      navigation={NAVIGATION}

    >
      <DashboardLayout

        slots={{
          toolbarAccount:WecomeToolAction,
          sidebarFooter: SidebarFooter , // Pass props if needed
        }}
      >


        <PageContainer>
          <Routes>
            <Route path="/home" element={<Home user={user} />} />
            <Route path="/eventmanagement" element={<EventManagement />} />
            <Route path="/wastemanagement" element={<WasteManagement />} />
            <Route path="/analytics" element={<Analytics user={user} />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
          </Routes>
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
