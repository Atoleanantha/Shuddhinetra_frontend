import React, { useState } from 'react';
import { Snackbar, Button, TextField, Box, Alert, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { CSSTransition } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.webp';
import { postDataApi } from '../services/apiService';
import { Grid, Paper, Typography, Link } from '@mui/material';
import '../css/styles.css';

const Auth = ({ setUser }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [divisionType, setDivisionType] = useState('Divisional');
  const [divisionPincode, setDivisionPincode] = useState('');

  const [popup, setPopup] = useState({ open: false, message: '', type: '' });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));

  const signIn = async () => {
    setLoading(true);
    try {
      const data = await postDataApi(`/user-auth/login/`, { username, password });
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user[0]));
        localStorage.setItem('login', JSON.stringify(data));
        setUser(data.user[0]);

        console.log("data:", data);

        showPopup('Login successful', 'success');
        navigate('/dashboard', { replace: true });
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      showPopup('Invalid credentials, please try again', 'error');
    } finally {
      setLoading(false);
    }
  };



  const handleRegister = async () => {
    if (password !== confirmPassword) {
      showPopup('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      const newUser = {
        username,
        password,
        confirm_password: confirmPassword,
        full_name: fullName,
        phone_number: phoneNumber,
        email,
        address,
        pincode,
      };

      var data = null;
      if (divisionType === 'Sub-Divisional') {
        newUser['division_pincode'] = divisionPincode;
        data = await postDataApi('/user-auth/signup/sub-division/', newUser);
      } else {
        data = await postDataApi('/user-auth/signup/division/', newUser);
      }

      console.log("register:", data.token);
      setToken(data.token)
      localStorage.setItem('authToken', data.token)
      setUser(data.user[0])
      showPopup('Registration successful', 'success');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during registration:', error);
      showPopup('Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showPopup = (message, type) => {
    setPopup({ open: true, message, type });
  };

  const handleFlip = () => {
    setShowRegister((prev) => !prev);
  };

  const handleForgotPassword = () => setShowForgotPassword(true);

  const handleCloseSnackbar = () => setPopup({ ...popup, open: false });

  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (

    <Box
      sx={{
        backgroundImage: 'url(/16922846_5820617.jpg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',


        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: "10px"
      }}
    >
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={8}>
          <Paper elevation={10} sx={{ borderRadius: '1rem', overflow: 'hidden', position: 'relative' }}>
            <CSSTransition in={!showForgotPassword} timeout={500} classNames="fade" unmountOnExit>
              <Box>
                <CSSTransition in={!showRegister} timeout={500} classNames="flip" unmountOnExit>
                  <Box>
                    {/* Login Form */}
                    <Grid container>
                      <Grid item xs={12} sm={6}>
                        <img
                          src="https://thumbs.dreamstime.com/b/prakash-indian-postman-223377163.jpg"
                          alt="login form"
                          className="img-fluid"

                          style={{
                            width: '410px', // Specify your desired width
                            height: '600px', // Specify your desired height
                            objectFit: 'cover', // Crops to fill the container while maintaining the aspect ratio
                            objectPosition: 'left', // Center the cropped image
                            top: '590px',

                            // borderRadius: '10px', // Optional: Add rounded corners
                            //boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Optional: Add shadow for a 3D effect
                          }}
                        />


                      </Grid>
                      <Grid item xs={12} sm={6} sx={{ p: 4, width: '100%' }}>
                        <img
                          src="https://static.vecteezy.com/system/resources/previews/048/958/438/non_2x/security-camera-isolated-on-white-backdrop-graphic-illustration-surveillance-equipment-concept-of-modern-security-technology-monitoring-protection-print-logo-sign-design-element-vector.jpg"
                          alt="Security Camera"
                          style={{
                            position: 'absolute',
                            top: '0%',

                            left: '92%',
                            transform: 'translateX(-50%)',
                            zIndex: 10, // Ensures the image is above the card
                            width: '200px', // Adjust as needed
                            height: 'auto',

                          }}
                        />
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg-L2VWHT70GAAwcKtig0cAgde97UchNacHQ&s"
                          alt="Security Camera"
                          style={{
                            position: 'absolute',
                            bottom: '0%',

                            left: '95%',
                            transform: 'translateX(-50%)',
                            zIndex: 11, // Ensures the image is above the card
                            width: '70px', // Adjust as needed
                            height: 'auto',

                          }}
                        />

                        <img
                          src={`${process.env.PUBLIC_URL}/clean_staff.jpg`}
                          alt="Security Camera"
                          style={{
                            position: 'absolute',
                            bottom: '0%',
                            //top:'10%',

                            left: '80%',
                            transform: 'translateX(-50%)',
                            zIndex: 3, // Ensures the image is above the card
                            width: '220px', // Adjust as needed
                            height: 'auto',

                          }}
                        />

                        <img
                          src="https://www.shutterstock.com/shutterstock/videos/1087463630/thumb/7.jpg?ip=x480://thumbs.dreamstime.com/z/d-chart-icon-arrow-point-up-green-bar-d-chart-icon-arrow-point-up-green-bar-141857425.jpg"
                          alt="Security Camera"
                          style={{
                            position: 'absolute',
                            bottom: '0%',
                            //top:'10%',

                            left: '54%',
                            transform: 'translateX(-50%)',
                            zIndex: 1, // Ensures the image is above the card
                            width: '270px', // Adjust as needed
                            height: 'auto',

                          }}
                        />

                       

                        <Typography variant="h4" fontWeight="bold" color="error" sx={{ mb: 3 }}>
                          Login
                        </Typography>
                        <TextField sx={{ zIndex: 11 }}
                          fullWidth
                          label="Username"
                          variant="outlined"
                          margin="normal"
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                          fullWidth
                          label="Password"
                          type="password"
                          variant="outlined"
                          margin="normal"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                          onClick={signIn}
                          variant="contained"
                          color="error" // Uses Material-UI's predefined red
                          size="large"
                          fullWidth
                          sx={{ mt: 2, zIndex: 11 }}
                          disabled={loading}
                        >
                          {!loading ? 'Login' : 'Loading...'}
                        </Button>
                        <Typography variant="body2" sx={{ mt: 2, zIndex: 11 }}>
                          <Link href="#" underline="hover" onClick={handleForgotPassword} sx={{ zIndex: 11 }}>
                            Forgot password?
                          </Link>
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 3, color: '#393f81', zIndex: 11 }}>
                          Don't have an account?{' '}
                          <Link href="#" underline="hover" sx={{ color: '#393f81' }} onClick={handleFlip}>
                            Register here
                          </Link>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </CSSTransition>

                <CSSTransition in={showRegister} timeout={500} classNames="flip" unmountOnExit>
                  <Box>
                    {/* Registration Form */}
                    <Grid container>
                      <Grid item xs={12} sm={6}>
                        <img
                          // src=".\assets\IMG_20241206_100801.jpg"

                          src={`${process.env.PUBLIC_URL}/IMG_20241206_112647 (1).jpg`}
                          alt="login form"
                          className="img-fluid"
                          style={{
                            width: '450px', // Specify your desired width
                            height: '700px', // Specify your desired height
                            objectFit: 'cover', // Crops to fill the container while maintaining the aspect ratio
                            objectPosition: 'left', // Center the cropped image
                            left: '300px',
                            bottom: '100px',
                            // borderRadius: '10px', // Optional: Add rounded corners
                            // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Optional: Add shadow for a 3D effect
                          }}
                        />

                      </Grid>
                      <Grid item xs={12} sm={6} md={6} sx={{ p: 4, width: '100%' }}>
                        <img
                          src="https://static.vecteezy.com/system/resources/previews/048/958/438/non_2x/security-camera-isolated-on-white-backdrop-graphic-illustration-surveillance-equipment-concept-of-modern-security-technology-monitoring-protection-print-logo-sign-design-element-vector.jpg"
                          alt="Security Camera"
                          style={{
                            position: 'absolute',
                            top: '0%',

                            left: '92%',
                            transform: 'translateX(-50%)',
                            zIndex: 10, // Ensures the image is above the card
                            width: '200px', // Adjust as needed
                            height: 'auto',

                          }}
                        />

                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg-L2VWHT70GAAwcKtig0cAgde97UchNacHQ&s"
                          alt="Security Camera"
                          style={{
                            position: 'absolute',
                            bottom: '0%',

                            left: '95%',
                            transform: 'translateX(-50%)',
                            zIndex: 11, // Ensures the image is above the card
                            width: '70px', // Adjust as needed
                            height: 'auto',

                          }}
                        />

                        
                        <img
                          src={`${process.env.PUBLIC_URL}/Shuddhi_netra_logo.jpg`}
                          alt="Security Camera"
                          style={{
                            position: 'absolute',
                            bottom: '1%',
                            //top:'10%',

                            left: '38%',
                            transform: 'translateX(-50%)',
                            zIndex: 3, // Ensures the image is above the card
                            width: '220px', // Adjust as needed
                            height: 'auto',

                          }}
                        />

                        


                        <Typography variant="h4" fontWeight="bold" color="error" sx={{ mb: 2, zIndex: 9 }}>
                          Register
                        </Typography>
                        <TextField sx={{ zIndex: 12 }}
                          fullWidth
                          label="Full Name"

                          variant="outlined"
                          margin="dense"
                          onChange={(e) => setFullName(e.target.value)}
                        />
                        <TextField
                          fullWidth
                          label="Username"
                          variant="outlined"
                          margin="dense"
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                          fullWidth
                          label="Phone Number"
                          variant="outlined"
                          margin="dense"
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <TextField
                          fullWidth
                          label="Email"
                          variant="outlined"
                          margin="dense"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                          fullWidth
                          label="Address"
                          variant="outlined"
                          margin="dense"
                          onChange={(e) => setAddress(e.target.value)}
                        />
                        <TextField
                          fullWidth
                          label="Pincode"
                          variant="outlined"
                          margin="dense"
                          onChange={(e) => setPincode(e.target.value)}
                        />
                        <TextField
                          fullWidth
                          label="Password"
                          type="password"
                          variant="outlined"
                          margin="dense"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                          fullWidth
                          label="Confirm Password"
                          type="password"
                          variant="outlined"
                          margin="dense"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <RadioGroup
                          value={divisionType}
                          onChange={(e) => setDivisionType(e.target.value)}
                          sx={{ mt: 2 }}
                        >
                          <FormControlLabel
                            value="Sub-Divisional"
                            control={<Radio color="error" />}
                            label="Sub-Divisional Office"
                          />
                        </RadioGroup>
                        {divisionType === 'Sub-Divisional' && (
                          <TextField
                            fullWidth
                            label="Division Pincode (Optional)"
                            variant="outlined"
                            margin="dense"
                            onChange={(e) => setDivisionPincode(e.target.value)}
                          />
                        )}
                        <Button
                          onClick={signIn}
                          variant="contained"
                          color="error" // Uses Material-UI's predefined red
                          size="large"
                          fullWidth
                          sx={{ mt: 2 }}
                          disabled={loading}
                        >
                          {!loading ? 'Register' : 'Loading...'}
                        </Button>
                        <Typography variant="body2" sx={{ mt: 3 }}>
                          Already have an account?{' '}
                          <Link href="#" underline="hover" onClick={handleFlip}>
                            Login here
                          </Link>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </CSSTransition>
              </Box>
            </CSSTransition>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={popup.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={popup.type}>
          {popup.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Auth;






