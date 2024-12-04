import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Divider, Grid2 } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid2';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import EditIcons from '@mui/icons-material/Edit';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
import { format } from "date-fns";

function Notification({ notification }) {
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = useState(localStorage.getItem("login"));
  const [isLoading, setLoading] = useState(false);

  const handleViewDetails = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function NotificationDetailsDialog() {
    const [edit, setEdit] = React.useState(false);
    const isSubDivisional = localStorage.getItem('user').division_pincode ? true : false;
    const alertAtSubdivion = notification.level === "SUBDIVISIONAL" ? true : false;
    let actionPerformed = false;
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [action, setAction] = useState(notification['action_performed']);
    const [response, setResponse] = useState(notification['response']);
   

    useEffect(() => {
      setUser(localStorage.getItem('login'));
    });

    const handleEdit = () => {
      setEdit(true);
    };

    const handleSave = () => {
      addAction()
      setEdit(false);
    };

    const handleAlertClose = () => {
      setOpenAlert(false);
    };

    const addAction = () => {
      setLoading(true); // Start loading
      const data = {
        "action_performed": action,
        "is_resolved": true,
      };
      const config = {
        headers: {
          Authorization: `Token ${user.token}`,
        },
      };
      console.log(notification.id ,data);
      
      axios.put(`http://127.0.0.1:8000/api/v1/notify/notifications/${notification.id}/`, data, config)
      .then(response => {
        if (response.status === 200) {
          // Action saved successfully
          console.log("Action saved:", response.data);
          setLoading(false); // Stop loading
          setAlertSeverity('success');
          setAlertMessage('Action has been successfully saved!');
          setOpenAlert(true);
        }
      })
      .catch(error => {
        setLoading(false); // Stop loading
        if (error.response) {
          // Server responded with an error
          console.error("Error response:", error.response.data);
          setAlertSeverity('error');
          setAlertMessage(`Failed to save the action: ${error.response.data.message || "Please try again."}`);
        } else {
          // Network error or other issue
          console.error("Network error:", error);
          setAlertSeverity('error');
          setAlertMessage('Failed to save the action due to network issues.');
        }
        setOpenAlert(true);
      });
    
    };

    const addResponse = () => {
      setLoading(true); // Start loading
      const data = {
        "response": response,
      };
      const config = {
        headers: {
          Authorization: `Token ${user.token}`,
        },
      };
      axios.put(`http://127.0.0.1:8000/api/v1/notify/notification/${notification.id}/`, data, config)
        .then(response => {
          console.log("Response saved:", response.data);
          setLoading(false); // Stop loading
          setAlertSeverity('success');
          setAlertMessage('Response has been successfully saved!');
          setOpenAlert(true);
        })
        .catch(error => {
          console.error("Error saving response:", error);
          setLoading(false); // Stop loading
          setAlertSeverity('error');
          setAlertMessage('Failed to save the response. Please try again.');
          setOpenAlert(true);
        });
    };


    function cleanImageUrl(imageUrl) {
      const prefix = "http://127.0.0.1:8000/media/https%3A/";
      if (imageUrl.startsWith(prefix)) {
          // Remove the unwanted prefix
          return imageUrl.replace(prefix, "https://");
      }
      // Return the original URL if no prefix found
      return imageUrl;
  }
  
    return (
      <React.Fragment>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Slide} // Use Transition here
        >
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {notification.pincode}
              </Typography>
              {edit ? (
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  size="small"
                  color="red"
                  startIcon={<CloseIcon fontSize="inherit" />}
                  sx={{ mr: 2 }}
                >
                  Close
                </Button>
              ) : " "}
              {
                edit ? (
                  <Button
                    onClick={handleSave}
                    variant="outlined"
                    size="small"
                    color="neutral"
                    startIcon={<SaveIcon fontSize="inherit" />}
                  >
                    Save Response
                  </Button>
                ) :
                  (
                    <Button
                      onClick={handleEdit}
                      variant="outlined"
                      size="small"
                      color="neutral"
                      startIcon={<EditIcons fontSize="inherit" />}
                    >
                      Edit
                    </Button>
                  )
              }
            </Toolbar>
          </AppBar>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={4} size={5}>
              <div
                style={{
                  border: '1px solid #ccc',
                  padding: '16px',
                  margin: '16px',
                  marginTop: '30px',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  width: '100%',
                  height: '100%',
                }}
              >
                <img
                  src={cleanImageUrl(notification.image)}
                  alt={'Beautiful scenery'}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'fill',
                    borderRadius: '8px',
                  }}
                />
              </div>
            </Grid>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Grid item xs={12} sm={12} md={4} size={6}>
              <div
                style={{
                  padding: '16px',
                  marginTop: '30px',
                  width: '100%',
                  height: '100%',
                }}
              >
                <Typography variant="h5" paddingBottom={2}>Alert Details</Typography>
                <Typography variant="body1">
                  <strong>Post Office Name:</strong> {notification.pincode}
                </Typography>
                <Typography variant="body1">
                  <strong>Address:</strong> {notification.address}
                </Typography>
                <Typography variant="body1">
                  <strong>Date:</strong> {format(new Date(notification.createdAt), "MMMM dd, yyyy hh:mm:ss a 'UTC'")}
                </Typography>
                <Typography variant="body1">
                  <strong>Resolved:</strong>{(!actionPerformed && isSubDivisional) ? "None, You can resolve it" : "Not Resolved"}
                </Typography>
                <Typography variant="body1">
                  <strong>Action Taken:</strong> {isSubDivisional ? "None, You can perform action" : "Not Taken"}
                </Typography>
                <Typography variant="body1">
                  <strong>Response from Division:</strong> {user.is_divisional ? "None, You have not given you can give response" : "Not Taken"}
                </Typography>
                <Typography variant="body1">
                  <strong>Alert At Level:</strong> Divisional Office.
                </Typography>

                <div
                  style={{
                    marginTop: '20px',
                  }}
                >
                  {user.is_divisional ?
                    <TextField id="outlined-basic" label="Add Response" value={response} disabled={!(edit && !actionPerformed)} onChange={(e) => setResponse(e.target.value)} variant="outlined" />
                    :
                    <TextField id="outlined-basic" label="Add Action" value={action} disabled={!(edit && !actionPerformed)} onChange={(e) => setAction(e.target.value)} variant="outlined" />
                  }
                </div>
              </div>
            </Grid>
          </Grid>
        </Dialog>
        <Snackbar
          open={openAlert}
          autoHideDuration={6000}
          onClose={handleAlertClose}
        >
          <Alert onClose={handleAlertClose} severity={alertSeverity}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </React.Fragment>
    );
  }

  return (
    <div>
      <Card
        sx={{
          marginTop: 2,
          borderRadius: 2,
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
            {notification.pincode || 'Unnamed Post Office'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
            Address: {notification.pincode || 'Not Available'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
            Date & Time: {format(new Date(notification.createdAt), "MMMM dd, yyyy hh:mm:ss a 'UTC'") || 'Not Available'}
          </Typography>
          <Divider sx={{ marginY: 1 }} />
          <Grid2 container direction="row" justifyContent="space-between">
            <Button
              variant="contained"
              onClick={handleViewDetails}
              endIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : null}
              disabled={isLoading} // Disable the button while loading
            >
              {isLoading ? 'Saving...' : 'View Details'}
            </Button>
          </Grid2>
        </CardContent>
      </Card>

      {open && <NotificationDetailsDialog />}
    </div>
  );
}

export default Notification;
