import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const Logout = ({ onLogout }) => {
  const [open, setOpen] = useState(true); // Start with the dialog open
  const navigate = useNavigate();

  const handleConfirm = () => {
    onLogout(); // Perform the logout action
    setOpen(false);
    localStorage.removeItem('user'); // Clear persisted data
    navigate('/login', { replace: true }); // Navigate to login after logout
  };

  const handleCancel = () => {
   
    setOpen(false);
    navigate(-1); // Go back to the previous page if logout is canceled
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Confirm Logout</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to log out?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="error">
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Logout;
