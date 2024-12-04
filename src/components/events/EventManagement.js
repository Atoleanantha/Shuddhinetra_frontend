import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid2,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";
import { addEvent, addEventReport, getApi, getEventReport, postDataApi } from "../../services/apiService";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import EventDetail from './EventDetail'

import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import axios from "axios";

// Styled component for Drag and Drop
const DropZone = styled("div")(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: "8px",
  padding: "20px",
  textAlign: "center",
  color: theme.palette.text.secondary,
  cursor: "pointer",
  marginBottom: "20px",
}));

const EventManagement = () => {


  const [login, setLogin] = useState(JSON.parse(localStorage.getItem("login")))
  useState(() => {
    setLogin(JSON.parse(localStorage.getItem("login")))
  })



  const [events, setEvents] = useState([])
  const getEvents = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const config = {
        headers: {
          Authorization: `Token ${token}`, // Pass the token for authentication
        },
      }

      const event = await getApi("/waste-management/events/get-events/", config)
      setEvents(event?.data || [])
      console.log("events:", event.data);
    } catch (e) {
      console.log("error event:", e);
    }
  }
  useEffect(() => {
    getEvents()

  }, [login])


  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const [open, setOpen] = React.useState(false);
  const [currentEvent, setCurrentEvent] = useState({})
  const handleClickOpen = (event) => {
    setCurrentEvent(event)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [grFile, setGrFile] = useState(null);
  const [grError, setGrError] = useState(false);



  const [grDetails, setGrDetails] = useState({
    grTitle: "",
    grDescription: "",
  });


  // GR Report Handlers
  const handleGRDrop = (e) => {
    e.preventDefault();
    setGrFile(e.dataTransfer.files[0]);
  };
  const handleGRFileChange = (e) => {
    const file = e.target.files[0];
    // if (file.type !== "application/pdf") {
    //   setGrError(true);
    //   return;
    // }


    setGrFile(file);
  };



  const handleGRInputChange = (e) => {
    const { name, value } = e.target;
    setGrDetails({ ...grDetails, [name]: value });
  };
  const [loading, setLoading] = useState(false)

  const handleSubmitGRReport = async (e) => {
    e.preventDefault();

    if (!grFile || !grDetails.grTitle || !grDetails.grDescription) {
      setGrError(true);
      return;
    }
    // console.log("gerror:",grFile);


    const data = new FormData();
    data.append("title", grDetails.grTitle);
    data.append("description", grDetails.grDescription);
    data.append("attachment", grFile);
    data.append("date_time", new Date().toISOString());
    data.append("pincode", login?.user?.pincode);
    console.log(data.has("attachment"));
    // Log all key-value pairs in the FormData




    try {
      setLoading(true);
      const res = await addEvent(data); // Ensure `addEvent` supports `FormData`

      console.log("New event response:", res);
      setGrDetails({ grTitle: "", grDescription: "" });
      setGrFile(null);
      setLoading(false);
      setOpen(false);
    } catch (e) {
      console.error("Error uploading event:", e);
      setLoading(false);
    }
  };


  // ************ Dialog ******************
  function FullScreenDialog() {

    const [loading, setLoading] = useState(false)
    const [eventDetails, setEventDetails] = useState({
      eventTitle: "",
      eventDescription: "",
      eventDate: "",
      eventLocation: "",
    });
    eventDetails.eventTitle = currentEvent.title;

    const [eventReportFile, setEventReportFile] = useState(null);
    const [eventError, setEventError] = useState(false);

    const [eventHistory, setEventHistory] = useState([]);

    // Event Report Handlers
    const handleEventReportDrop = (e) => {
      e.preventDefault();
      setEventReportFile(e.dataTransfer.files[0]);
    };

    const handleEventReportFileChange = (e) => {
      setEventReportFile(e.target.files[0]);
    };

    const handleEventReportInputChange = (e) => {
      const { name, value } = e.target;
      setEventDetails({ ...eventDetails, [name]: value });
    };

    const handleSubmitEventReport = async (e) => {

      e.preventDefault();
      if (
        !eventReportFile ||
        !eventDetails.eventTitle ||
        !eventDetails.eventDescription ||
        !eventDetails.eventDate ||
        !eventDetails.eventLocation
      ) {
        setEventError(true);
        return;
      }
      setEventError(false);

      // Add event details to event history
      const newEvent = {
        eventId: eventHistory.length + 1,
        ...eventDetails,
        eventReportFile: eventReportFile,
      };
      setEventHistory([...eventHistory, newEvent]);

      setLoading(true)

      try {

        // const res=postDataApi("/waste-management/events/") create event
        const data = {
          name: eventDetails.eventTitle,
          event_id: currentEvent.id,
          report_description: eventDetails.eventDescription,
          attached_report: eventReportFile,
          atLocation: eventDetails.eventLocation,
          date_time: eventDetails.eventDate,
          pincode: login?.user?.pincode
        };
        const res = await addEventReport(data) //create event-report.
        console.log(res);

        // const res=getDataApi("/waste-management/event-report/") create event-report
        // const res=delete("/waste-management/event-report/{id}/") delete event-report
        // Implement API requests here
        // Clear form data
        setEventDetails({
          eventTitle: "",
          eventDescription: "",
          eventDate: "",
          eventLocation: "",
        });
        setEventReportFile(null);

        setLoading(false)
        setOpen(false)
      } catch (e) {
        console.error("Error uploading event Report:", e);
        setLoading(false)
      }
    };

    const [reports, setReports] = useState([])
    const getReports = async () => {
      try {
        const res = await getEventReport(currentEvent.id)
        console.log("event report", res.data)
        if (res.status === 200) {
          setReports(res.data.data)
        }
      } catch (e) {
        console.log(" geting report error: ", e);

      }
    }
    useEffect(() => {
      if (login.is_divisional && open) {
        getReports();
      }

    }, [currentEvent])

    return (
      <React.Fragment>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: "relative" }}>
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
                {currentEvent.title}
              </Typography>
            </Toolbar>
          </AppBar>
          <Grid container spacing={2}>
            <Grid item xs={6} md={8}>
              <div
                style={{
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: 4,
                }}
              >
                {login.is_sub_divisional && (
                  <Box
                    sx={{
                      padding: "20px",
                      borderRadius: "8px",
                      boxShadow: 4,
                      backgroundColor: "background.paper",
                      mb: 5,
                    }}
                  >
                    <form onSubmit={handleSubmitEventReport}>
                      <DropZone
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleEventReportDrop}
                        onClick={() =>
                          document.getElementById("eventReportInput").click()
                        }
                      >
                        <CloudUploadIcon sx={{ fontSize: 50 }} />
                        <Typography variant="body2">
                          {eventReportFile
                            ? `File Uploaded: ${eventReportFile.name}`
                            : "Drag and drop an event report, or click to upload"}
                        </Typography>
                        <input
                          id="eventReportInput"
                          type="file"
                          onChange={handleEventReportFileChange}
                          style={{ display: "none" }}
                        />
                      </DropZone>

                      <TextField
                        label="Event Title"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 3 }}
                        name="eventTitle"
                        value={eventDetails.eventTitle}
                        onChange={handleEventReportInputChange}
                      />

                      <TextField
                        label="Event Description"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ mb: 3 }}
                        name="eventDescription"
                        value={eventDetails.eventDescription}
                        onChange={handleEventReportInputChange}
                      />

                      <TextField
                        label="Event Date"
                        type="date"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 3 }}
                        name="eventDate"
                        value={eventDetails.eventDate}
                        onChange={handleEventReportInputChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />

                      <TextField
                        label="Event Location"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 3 }}
                        name="eventLocation"
                        value={eventDetails.eventLocation}
                        onChange={handleEventReportInputChange}
                      />

                      {eventError && (
                        <Typography color="error" sx={{ mb: 2 }}>
                          All fields are mandatory.
                        </Typography>
                      )}

                      <LoadingButton
                        loading={loading}
                        loadingPosition="start"
                        type="submit"
                        startIcon={<SaveIcon />}
                        variant="contained"
                        color="primary"
                        fullWidth

                      >
                        Submit Event Report
                      </LoadingButton>

                    </form>
                  </Box>
                )}

                {login.is_divisional && (
                  <Box
                    sx={{
                      padding: "20px",
                      borderRadius: "8px",
                      boxShadow: 4,
                      backgroundColor: "background.paper",
                      mb: 5,
                    }}
                  >
                    {reports.length == 0 ? "No Reports till submitted"
                      : <div style={{ height: 350, width: '100%' }}>
                        <DataGrid
                          columns={[
                            { field: 'Id' },
                            { field: 'Pincode', hideable: false },
                            { field: 'Title' },
                            { field: 'Decription' },
                            { field: 'Date_Time' },
                            { field: 'Location' },
                            {
                              field: 'Report',
                              headerName: 'Report',
                              width: 150,
                              renderCell: (params) => (
                                <a
                                  href={params.row.Report}
                                  download={params.row.Title || "report.pdf"}
                                  style={{ textDecoration: 'none', color: 'blue' }}
                                >
                                  Download
                                </a>
                              ),
                            },
                          ]}
                          rows={reports.map((report, index) => {
                            return {
                              id: report['id'],
                              Pincode: report['pincode'],
                              Title: report['name'],
                              Decription: report['report_description'],
                              Date_Time: report['date_time'],
                              Location: report['atLocation'],
                              Report: report['attached_report'],


                            }
                          })}
                          slots={{
                            toolbar: GridToolbar,
                          }}
                        />
                      </div>}
                  </Box>
                )}


              </div>
            </Grid>
            <Grid item xs={6} md={4}>
              <EventDetail event={currentEvent} />
            </Grid>
          </Grid>
        </Dialog>
      </React.Fragment>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >

      {login.is_divisional ?
        <div>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Upload New Event
          </Typography>
          <Box
            sx={{
              padding: "20px",
              borderRadius: "8px",
              boxShadow: 4,
              backgroundColor: "background.paper",
              mb: 5,
            }}
          >
            <form onSubmit={handleSubmitGRReport}>
              <DropZone
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleGRDrop}
                onClick={() => document.getElementById("grFileInput").click()}
              >
                <CloudUploadIcon sx={{ fontSize: 50 }} />
                <Typography variant="body2">
                  {grFile
                    ? `File Uploaded: ${grFile.name}`
                    : "Drag and drop a GR attachment, or click to upload"}
                </Typography>
                <input
                  id="grFileInput"
                  type="file"
                  onChange={handleGRFileChange}
                  style={{ display: "none" }}
                />
              </DropZone>

              <TextField
                label="GR Title"
                variant="outlined"
                fullWidth
                sx={{ mb: 3 }}
                name="grTitle"
                value={grDetails.grTitle}
                onChange={handleGRInputChange}
              />

              <TextField
                label="GR Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                sx={{ mb: 3 }}
                name="grDescription"
                value={grDetails.grDescription}
                onChange={handleGRInputChange}
              />

              {grError && (
                <Typography color="error" sx={{ mb: 2 }}>
                  All fields are mandatory.
                </Typography>
              )}

              <Button type="submit" variant="contained" color="primary" fullWidth>
                Create New Event
              </Button>
            </form>
          </Box>
        </div> : ""}

      {/* Event History Table */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        Organised Events
      </Typography>
      <TableContainer component={Paper} sx={{ width: "100%", maxWidth: "900px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Event ID</TableCell>
              <TableCell>Event Title</TableCell>
              <TableCell>Discription</TableCell>
              <TableCell>Date</TableCell>
              {/* <TableCell>End Date</TableCell> */}
              <TableCell>Pincode</TableCell>
              <TableCell>Attachment</TableCell>
              <TableCell>{login.is_divisional ? "View Responses" : "Add Report"}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events?.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.id}</TableCell>
                <TableCell>{event.title}</TableCell>
                <TableCell>{event.description}</TableCell>
                <TableCell>{event.date_time}</TableCell>
                <TableCell>{event.pincode}</TableCell>
                {/* //we have to add pincode */}
                <TableCell>
                  <a
                    target="_blank"
                    href={event.attachment}  // URL from Cloudinary or your server
                    download={event.attachment.split('/').pop()}  // Extract the file name from URL
                  >
                    Download
                  </a>
                </TableCell>
                <TableCell><Button variant="outlined" size="small" onClick={() => { handleClickOpen(event) }}>
                  {login.is_divisional ? "View" : "ADD"}
                </Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <FullScreenDialog />
    </Box>
  );
};

export default EventManagement;
