import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { deleteCleaningStaff, fetchCleaningStaff } from '../../services/apiService';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCleaningStaff from './AddCleaningStaff';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import Button from '@mui/material/Button';
const CleaningStaffGrid = ({ login, setToken, user, token }) => {
  // console.log("grid:",cleaningStaff);


  const [cleaningStaff, setCleaningStaff] = useState([])

  const getStaff = async () => {
    const data = await fetchCleaningStaff()
    setCleaningStaff(data["data"])
  }

  useEffect(() => {
    const newToken = localStorage.getItem("authToken")
    setToken(newToken)
    if (login.is_sub_divisional) {
      getStaff()
    }
  }, [user, token])


  function createData(id, name, contact, post_office) {
    return { id, name, contact, post_office };
  }

  const rows = cleaningStaff.map((element) => {
    return createData(element['id'], element["name"], element["contactNo"], element["pincode"]);
  });

  const [loading, setLoading] = useState(false)

  const handleDeleteCleaningStaff = async (id) => {

    setLoading(true)
    try {
      const res = await deleteCleaningStaff(id)
      console.log(res);

    } catch (e) {
      console.error("error deleting:", e);

    } finally {
      setLoading(false)
    }
  }






  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 350 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Contact Number</TableCell>
            <TableCell align="right">Post Office</TableCell>
            <TableCell align="right">
              <React.Fragment>
                <LoadingButton onClick={handleClickOpen('body')} loading={false} variant="outlined" >
                  Add New
                </LoadingButton>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  scroll={scroll}
                  aria-labelledby="scroll-dialog-title"
                  aria-describedby="scroll-dialog-description"
                >
                  <AddCleaningStaff handleClose={handleClose}/>
                </Dialog>
              </React.Fragment>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.contact}</TableCell>
              <TableCell align="right">{row.post_office}</TableCell>
              <TableCell align="right"><LoadingButton key={row.id} variant="outlined" color="error" onClick={() => { handleDeleteCleaningStaff(row.id) }} loading={loading}
                loadingPosition="start" startIcon={<DeleteIcon />}>
                Delete
              </LoadingButton></TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CleaningStaffGrid