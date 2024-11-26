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
        setUser(data.user[0]);
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
        confirm_password:confirmPassword,
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
      localStorage.setItem('authToken',data.token)
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
        backgroundColor: '#9A616D',
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
                          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                          alt="login form"
                          className="img-fluid"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} sx={{ p: 4, width: '100%' }}>
                        <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
                          Login
                        </Typography>
                        <TextField
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
                          color="primary"
                          size="large"
                          fullWidth
                          sx={{ mt: 2 }}
                          disabled={loading}
                        >
                          {!loading ? 'Login' : 'Loading...'}
                        </Button>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          <Link href="#" underline="hover" onClick={handleForgotPassword}>
                            Forgot password?
                          </Link>
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 3, color: '#393f81' }}>
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
                          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                          alt="register form"
                          className="img-fluid"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={6} sx={{ p: 4, width: '100%' }}>
                        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                          Register
                        </Typography>
                        <TextField
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
                            control={<Radio />}
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
                          onClick={handleRegister}
                          variant="contained"
                          color="primary"
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
