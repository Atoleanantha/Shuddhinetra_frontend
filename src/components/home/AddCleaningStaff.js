import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, Grid, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import { addCleaningStaff } from '../../services/apiService';

// Custom 3D Styled Components
const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#2E7D32' : '#4CAF50',
  color: '#fff',
  borderRadius: '30px',
  padding: '12px 24px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#1B5E20' : '#45a049',
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const AddCleaningStaff = ({handleClose}) => {
  const [loading, setLoading] = useState(false)
  const theme = useTheme(); // To handle dark mode
  const [staffData, setStaffData] = useState({
    name: '',
    contact: '',
    email: '',
  });

  const [error, setError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaffData({ ...staffData, [name]: value });
  };

  const validateContact = (contact) => {
    const contactRegex = /^[0-9]{10}$/;
    return contactRegex.test(contact);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!staffData.name || !staffData.contact || !staffData.email) {
      setError('All fields are required.');
      return;
    }
    if (!validateContact(staffData.contact)) {
      setError('Please enter a valid 10-digit contact number.');
      return;
    }
    if (!validateEmail(staffData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError(false);
    setLoading(true)
    try {
      // Submit the staff data (e.g., send to an API or save to a database)
      const pincode = JSON.parse(localStorage.getItem("user"))?.pincode
      const data = {
        "name": staffData.name,
        "contactNo": staffData.contact,
        "pincode": pincode
      }
      const res = await addCleaningStaff(data)
      console.log('Staff added:', staffData);

      // Clear the form
      setStaffData({ name: '', contact: '', email: '' });
      handleClose()
    } catch (e) {
      setError("Something went wrong!")
    } finally {
      setLoading(false)

    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <Typography variant="h4" sx={{ mb: 3, color: theme.palette.primary.main }}>
        Add Cleaning Staff
      </Typography>

      <Card
        sx={{
          padding: '20px',
          borderRadius: '16px',
          boxShadow: 6,
          backgroundColor: theme.palette.background.paper,
          width: '100%',
          maxWidth: 600,
        }}
      >
        <form onSubmit={handleSubmit}>
          <StyledTextField
            label="Name"
            variant="outlined"
            fullWidth
            sx={{ mb: 3 }}
            name="name"
            value={staffData.name}
            onChange={handleInputChange}
          />
          <StyledTextField
            label="Contact Number"
            variant="outlined"
            fullWidth
            sx={{ mb: 3 }}
            name="contact"
            value={staffData.contact}
            onChange={handleInputChange}
            type="tel"
            inputProps={{ maxLength: 10 }}
          />
          <StyledTextField
            label="Email"
            variant="outlined"
            fullWidth
            sx={{ mb: 3 }}
            name="email"
            value={staffData.email}
            onChange={handleInputChange}
            type="email"
          />

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <StyledButton type="submit" variant="contained" fullWidth>
            {loading?"Loading...":"Add Staff"}
          </StyledButton>
        </form>
      </Card>
    </Box>
  );
};

export default AddCleaningStaff;
