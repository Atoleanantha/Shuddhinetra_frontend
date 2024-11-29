//import React from 'react'

import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTheme } from '@mui/material/styles'; // Material-UI Theme Hook
import { postDataApi, getDataApi, getApi } from '../../services/apiService';
import axios from 'axios';
import { transformToBarData, transformToEWasteData, transformToLineData, transformToPaperWasteData, transformToPieData } from './TransformData';

// Static Data for Charts
// const pieData = [
//   { name: 'Plastic Waste', value: 400 },
//   { name: 'Paper Waste', value: 300 },
//   { name: 'E-Waste', value: 200 },
//   { name: 'Organic Waste', value: 100 },
// ];

// const eWasteData = [
//   { name: 'Solar Panels', value: 60 },
//   { name: 'Fans', value: 40 },
//   { name: 'Printers', value: 50 },
//   { name: 'Computers', value: 30 },
// ];

// const lineData = [
//   { time: 'Jan', value: 200 },
//   { time: 'Feb', value: 250 },
//   { time: 'Mar', value: 220 },
//   { time: 'Apr', value: 300 },
//   { time: 'May', value: 280 },
// ];

// const barData = [
//   { month: 'Jan', generated: 400, sold: 300, revenue: 9000 },
//   { month: 'Feb', generated: 350, sold: 250, revenue: 7500 },
//   { month: 'Mar', generated: 500, sold: 400, revenue: 12000 },
//   { month: 'Apr', generated: 600, sold: 500, revenue: 15000 },
//   { month: 'May', generated: 450, sold: 350, revenue: 10500 },
// ];

// const paperWasteData = [
//   { month: 'Jan', paperWaste: 200, soldWaste: 150, revenue: 4500 },
//   { month: 'Feb', paperWaste: 180, soldWaste: 130, revenue: 3900 },
//   { month: 'Mar', paperWaste: 220, soldWaste: 180, revenue: 5400 },
//   { month: 'Apr', paperWaste: 250, soldWaste: 210, revenue: 6300 },
//   { month: 'May', paperWaste: 200, soldWaste: 170, revenue: 5100 },
// ];

const COLORS = ['#dc143c', '#4b0082', '#800000', '#ffa500'];

export const Analytics = ({ user }) => {
  const theme = useTheme(); // Material-UI Theme Hook
  const isDarkMode = theme.palette.mode === 'dark'; // Detect dark mode
  const [token, setToken] = useState(localStorage.getItem("authToken"))

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // ********* Analytics data **************
  const [paperAnalytics, setPaperAnalytics] = useState({})
  const [eWasteAnalytics, setEWasteAnalytics] = useState({data:[]})
  const [selledPaperAnalytics, setSelledPaperAnalytics] = useState({data:[]})

  const [pieData, setPieData] = useState([])
  const [eWasteData,setEWasteData]=useState([])
  const [lineData,setLineData]=useState([])
  const [barData,setBarData]=useState([])
  const [paperWasteData,setPaperWasteData]=useState([])

  useEffect(() => {
    setPieData(transformToPieData(paperAnalytics, eWasteAnalytics));
    // console.log('Pie Data:', pieData);

    setEWasteData(transformToEWasteData(eWasteAnalytics ));
   
    setLineData( transformToLineData(paperAnalytics?.data || []))

    setBarData(transformToBarData(paperAnalytics?.data || [],selledPaperAnalytics?.data||[]))

    setPaperWasteData(transformToPaperWasteData(paperAnalytics))

    

  }, [paperAnalytics,eWasteAnalytics])


  const getWasteData = async () => {
    const config = {
      headers: {
        Authorization: `Token ${token}`, // Pass the token for authentication
      },
    }
    try {
      const ewasteData = await getApi("/waste-management/ewaste/analytics/", config)
      setEWasteAnalytics(ewasteData)
      const paperwasteData = await getApi("/waste-management/paperwaste/analytics/", config)
      setPaperAnalytics(paperwasteData)
      const selledpapaerwasteData = await getApi("/waste-management/selledpaperwaste/analytics/", config)
      setSelledPaperAnalytics(selledpapaerwasteData)
      console.log("ewaste waste", ewasteData);
      console.log("paper waste", paperwasteData);
      console.log("selled paper waste", selledpapaerwasteData);

    } catch (e) {
      console.error("waste Data error", e);

    }
  }

  const addPaperWaste = async () => {
    const config = {
      headers: {
        Authorization: `Token ${token}`, // Pass the token for authentication
      },
    }
    const data = {
      "weight": 10,
      "date": "2024-11-28",
      "name": "peper  bord",
      // "pincode": "414005"
    }
    try {
      const res = await postDataApi("/waste-management/paperwaste/add-data/", data, config)
      console.log("Add paper waste response:", res.data); // Log the response data
    } catch (e) {
      console.error("Error adding paper waste:", e.response?.data?.message || e.message); // Handle errors gracefully
    }
  }

  const addEWaste = async () => {
    const config = {
      headers: {
        Authorization: `Token ${token}`, // Pass the token for authentication
      },
    }


    const data = {

      "no_of_units": 100,
      "date_time": "2024-11-25T15:30:00Z",
      "name": "Keybord Waste Collection",
      "pincode": user.pincode
    }
    try {
      const res = await postDataApi("/waste-management/ewaste/add-data/", data, config)
      console.log("Add E waste response:", res); // Log the response data
    } catch (e) {
      console.error("Error adding e waste:", e.response?.data?.message || e.message); // Handle errors gracefully
    }
  }

  const addSelledPaperWaste = async () => {
    const config = {
      headers: {
        Authorization: `Token ${token}`, // Pass the token for authentication
      },
    }


    const data = {
      "total_weight": 10,
      "total_price": 100,
      "selling_price_per_unit": 10,
      "date": "2024-11-25",
      "pincode": "414005"
    }
    try {
      const res = await postDataApi("/waste-management/selledpaperwaste/add-data/", data, config)
      console.log("Add Selled paper waste response:", res); // Log the response data
    } catch (e) {
      console.error("Error adding selled paper waste:", e.response?.data?.message || e.message); // Handle errors gracefully
    }
  }

  useEffect(() => {
    setToken(localStorage.getItem('authToken'))
    getWasteData()



  }, [token])

  // Dynamic Card Style
  const cardStyle = {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '10px',
    boxShadow: isDarkMode
      ? '0 4px 8px rgba(255, 255, 255, 0.1)'
      : '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    width: '450px',
    height: '500px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const wideCardStyle = {
    ...cardStyle,
    width: '920px', // Wider card style for the Line Chart
  };

  const containerStyle = {
    padding: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
  };

  const datePickerStyle = {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '10px',
    boxShadow: isDarkMode
      ? '0 4px 8px rgba(255, 255, 255, 0.1)'
      : '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    width: '220px',
    height: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const titleStyle = {
    width: '100%',
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '30px',
    color: theme.palette.text.primary,
  };

  return (
    <div>
      <h2 style={titleStyle}>Analytics Dashboard</h2>

      {/* Date Pickers */}
      <div style={containerStyle}>
        <div style={datePickerStyle}>
          <label style={{ fontSize: '16px', color: theme.palette.text.primary }}><b>From</b></label>
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        </div>
        <div style={datePickerStyle}>
          <label style={{ fontSize: '16px', color: theme.palette.text.primary }}><b>To</b></label>
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
        </div>
      </div>

      {/* Container for Pie Charts */}
      <div style={containerStyle}>
        {/* Waste Distribution Pie Chart */}
        <div className="card" style={cardStyle}>
          <h3 style={{ color: theme.palette.text.primary }}>Total Waste Distribution</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={140}
                innerRadius={90}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* E-Waste Breakdown Pie Chart */}
        <div className="card" style={cardStyle}>
          <h3 style={{ color: theme.palette.text.primary }}>E-Waste Breakdown</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={eWasteData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={140}
                innerRadius={90}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {eWasteData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart */}
      <div className="card" style={wideCardStyle}>
        <h3 style={{ color: theme.palette.text.primary }}>Monthly Data</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#FF6384" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Charts */}
      <div style={containerStyle}>
        {/* Paper Generated vs Sold */}
        <div className="card" style={cardStyle}>
          <h3 style={{ color: theme.palette.text.primary }}>Total Paper Generated vs Sold</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="generated" fill="#8884d8" />
              <Bar dataKey="sold" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Paper Waste vs Sold Waste */}
        <div className="card" style={cardStyle}>
          <h3 style={{ color: theme.palette.text.primary }}>Paper Waste vs Sold Waste</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={paperWasteData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div
                        style={{
                          backgroundColor: theme.palette.background.paper,
                          padding: '10px',
                          border: `1px solid ${theme.palette.divider}`,
                          color: theme.palette.text.primary,
                        }}
                      >
                        <p>{`Month: ${payload[0].payload.month}`}</p>
                        <p>{`Paper Waste Sold: ${payload[1].value}`}</p>
                        <p>{`Revenue: $${payload[1].payload.revenue}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="paperWaste" fill="#FF8042" />
              <Bar dataKey="soldWaste" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};





