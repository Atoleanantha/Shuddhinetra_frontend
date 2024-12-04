import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import { Divider } from '@mui/material';
import NotificationIcon from '@mui/icons-material/NotificationImportantOutlined';
import ListIcon from '@mui/icons-material/ListAltOutlined';
import { getDataApi, postDataApi ,fetchCleaningStaff, deleteCleaningStaff} from '../../services/apiService'
import Badge from '@mui/material/Badge';
import Notification from './Notification';
import PostOfficeGridList from './PostOfficeGridList';
import axios from 'axios';
import CleaningStaffGrid from './CleaningStaffGrid';


const Home = ({ user }) => {
  const [postOffices, setPostOffice] = useState([])
  const [loading,setLoading]=useState(false)

  const [notifications, setNotifications] = useState([])
  const [token, setToken] = useState(localStorage.getItem("authToken"))
  const [login, setLogin] = useState(JSON.parse(localStorage.getItem('login')))
  const [is_divisional,setIsDivisional]=useState(login?.is_sub_divisional || null)

  const addSubPostOffice = async () => {

    const config = {
      headers: {
        Authorization: `Token ${token}`, // Pass the token for authentication
      },
    }
    const postOffice = {
      "pincode": "422608",
      "name": "sangamner Post Office",
      "contactNo": "5566778899",
      "address": "sangamner, Ahmednagar"
    }
    try {
      const res = await postDataApi("/post/postoffice/", postOffice, config)
      console.log("postoffice:", res.data)
      setPostOffice(res.data) // Update the state with fetched data
    } catch (error) {
      console.error("Error fetching post offices:", error)
    }
  }

  const fetchPostOffice = async () => {
    // console.log(token);

    const config = {
      headers: {
        Authorization: `Token ${token}`, // Pass the token for authentication
      },
    }
    try {
      const res = await getDataApi("/post/postoffice/", {}, config)
      // console.log("postoffice:", res.data)
      setPostOffice(res.data) // Update the state with fetched data
    } catch (error) {
      console.error("Error fetching post offices:", error)
    }
  }

  
  
  useEffect(() => {
    setIsDivisional(login.is_divisional)
  
  }, []);

  const fetchNotifications = async () => {
    // console.log(token);

    const config = {
      headers: {
        Authorization: `Token ${token}`, // Pass the token for authentication
      },
    }
    axios.get("http://127.0.0.1:8000/api/v1/notify/notifications/", config)
      .then(response => {
        // Handle success
        console.log("notifications: ", response.data);
        setNotifications(response.data)
      })
      .catch(error => {
        // Handle error
        console.error(error);
      });
  }
  useEffect(()=>{
    
    fetchNotifications()
    // const intervalId = setInterval(() => {
    //   fetchNotifications();
    // }, 30000); // 30,000 milliseconds = 30 seconds

    // Cleanup the interval on component unmount
    // return () => clearInterval(intervalId);
    
  },[user, token])
  
  useEffect(() => {
    const newToken = localStorage.getItem("authToken")


    setToken(newToken)
    fetchPostOffice()
  }, [user, token]) // Add token to the dependencies to trigger effect on token change


  const AnalyticCardHome = ({ name, count }) => {
    return (
      <Box sx={{ minWidth: 200 }}>
        <Card
          variant="outlined"
          sx={{
            position: 'relative', // Needed for pseudo-element positioning
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: 150, // Adjust height as needed
            width: 200, // Adjust width as needed
            textAlign: 'center',
            borderRadius: '8px', // Optional: Rounded corners
            overflow: 'hidden', // Ensure the pseudo-element stays within bounds
          }}
        >
          {/* Background Blur */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                'url("https://th.bing.com/th?id=OIP.fvrf00-2StWdCIH8QSVfqwAAAA&w=279&h=223&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2")', // Background image
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(5px)', // Apply blur to the image
              zIndex: 0, // Place it behind content
            }}
          />

          {/* Card Content */}
          <CardContent
            sx={{
              position: 'relative',
              zIndex: 1, // Ensure content is above the blurred background
              color: '#fff', // Make text readable
            }}
          >
            <Typography gutterBottom sx={{ fontSize: 16 }}>
              {name}
            </Typography>
            <Typography
              gutterBottom
              sx={{
                fontSize: 30,
                fontWeight: 'bold',
              }}
            >
              {count}
            </Typography>
          </CardContent>
        </Card>


      </Box>
    )
  }
  return (
    <div>
      <h2>Home Content</h2>

      <Grid container spacing={0} >
        <Grid size={3}>
          <AnalyticCardHome name="Total Post Office" count={postOffices?.length || 0} />
        </Grid>
        <Grid size={3}>
          <AnalyticCardHome name="Total Alert of months" count={notifications?.length || 0} />
        </Grid>
        <Grid size={3}>
          <AnalyticCardHome name="Total paper waste" count="100 kg" />
        </Grid>
        <Grid size={3}>
          <AnalyticCardHome name="Total Revenue" count="1000 Rs" />
        </Grid>

      </Grid>


      <h4>Welcome, {user?.username || 'Guest'}</h4>
      {/* Display fetched post offices or a message if no data */}
      <Grid container spacing={2}>
        {/* First Column: Post Offices List */}
        {is_divisional?
          <Grid item xs={12} sm={12} md={8} size={8}>
            <div
              style={{
                border: '1px solid #ccc',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                width: '100%', // Ensure it fills the grid column

              }}
            >
              <Typography variant="h5" sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
                <Badge color="error" variant="dot" overlap='circular' badgeContent="  " anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}>
                  <ListIcon sx={{ marginRight: 1 }} />
                </Badge>
                Post Offices
              </Typography>
              {/* Post Offices List */}
              <PostOfficeGridList postOffices={postOffices} />
            </div>
          </Grid>
          :<Grid item xs={12} sm={12} md={8} size={8}>
            <div
              style={{
                border: '1px solid #ccc',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                width: '100%', // Ensure it fills the grid column

              }}
            >
              <Typography variant="h5" sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
                <Badge color="error" variant="dot" overlap='circular' badgeContent="  " anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}>
                  <ListIcon sx={{ marginRight: 1 }} />
                </Badge>
                Cleaning Staff
              </Typography>
            
             <CleaningStaffGrid token={token} setToken={setToken} login={login} user={user}/>
            </div>
          </Grid> 
        }




        {/* Second Column: Notifications */}
        <Grid
          item
          xs={12}
          sm={4}
          md={4}
          size={4}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end', // Aligns the notification column to the right
          }}
        >
          <div
            style={{
              border: '1px solid #ccc',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              width: '100%', // Ensure it fills the grid column
              maxWidth: 360, // Optional: Set a max width for consistency
            }}
          >
            <Typography variant="h5" sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
              <Badge color="error" variant="dot" overlap='circular' badgeContent="  " anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}>
                <NotificationIcon sx={{ marginRight: 1 }} />
              </Badge>
              Notifications
            </Typography>
            <List
              sx={{
                width: '100%',
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 350,
                '& ul': { padding: 0 },
                gap: 2, // Adds spacing between List items
              }}
              subheader={<li />}
            >
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '8px', // Adds space between individual notifications
                  }}
                >
                  <Notification
                    notification={notification}
                  />
                </div>
              ))}
            </List>
          </div>
        </Grid>
      </Grid>


    </div>
  )
}






export default Home
