import React from "react";
import { Card, CardContent,CardMedia, Typography, CardActions, Button, Grid } from "@mui/material";
import { format } from "date-fns"; // For date formatting

const EventDetail = ({ event, onEdit, onDelete }) => {
  const {id, title, description, date_time, pincode } = event;

  const isImage = (url) => {
    return /\.(jpg|jpeg|png|gif)$/i.test(url);
  };
 
  return (
    <Grid container justifyContent="center" style={{ marginTop: "2rem" }}>
      {/* <Grid item xs={12} sm={8} md={6}> */}
        <Card variant="outlined">
        {isImage(event.attachment) ? (
            <CardMedia
              component="img"
              height="350"
              image={event.attachment}
              alt="Event Attachment"
            />
          ) : (
            <Typography
              variant="body2"
              color="primary"
              style={{ margin: "1rem" }}
            >
              <a
                href={event.attachment}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "#1976d2" }}
              >
                View Attachment (PDF)
              </a>
            </Typography>
          )}
          <CardContent>
            <Typography variant="h4" component="div" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              {description}
            </Typography>
            <Typography variant="body2" color="textPrimary" gutterBottom>
              <strong>Date & Time:</strong>{" "}
              {format(new Date(date_time), "eeee, MMMM d, yyyy hh:mm a")}
            </Typography>
            <Typography variant="body2" color="textPrimary">
              <strong>Location (Pincode):</strong> {pincode}
            </Typography>
          </CardContent>
          <CardActions style={{ justifyContent: "flex-end" }}>
            {onEdit && (
              <Button variant="contained" color="primary" onClick={onEdit}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="outlined" color="secondary" onClick={onDelete}>
                Delete
              </Button>
            )}
          </CardActions>
        </Card>
      </Grid>
    // </Grid>
  );
};

export default EventDetail;
