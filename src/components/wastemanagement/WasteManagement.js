import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { styled, useTheme } from "@mui/system";
import { addWasteData, getWaste } from "../../services/apiService";

// Custom styled 3D Button
const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#2E7D32" : "#4CAF50",
  color: "#fff",
  borderRadius: "30px",
  padding: "12px 24px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s, box-shadow 0.2s",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? "#1B5E20" : "#45a049",
    transform: "translateY(-3px)",
    boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)",
  },
}));

// Custom 3D Effect Card Style
const CardStyle = styled(Box)(({ theme }) => ({
  padding: "20px",
  borderRadius: "16px",
  boxShadow: theme.shadows[6],
  backgroundColor: theme.palette.background.paper,
  marginBottom: "30px",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[10],
  },
}));

// Waste Management Component
const WasteManagement = () => {
  const theme = useTheme(); // Get current theme (light/dark)
  const [paperWaste, setPaperWaste] = useState({ weight: "", date: "" });
  const [eWaste, setEWaste] = useState({ units: "", model: "", date: "" });
  const [soldWaste, setSoldWaste] = useState({ weight: "", pricePerKg: "", totalPrice: "0", date: "" });
  const [alignment, setAlignment] = useState("Paper waste"); // For toggling between tables
  // const [login, setLogin] = useState(null);

  const [login, setLogin] = useState(JSON.parse(localStorage.getItem('login')))

  useEffect(() => {
    const storedLogin = localStorage.getItem('login');
    setLogin(storedLogin ? JSON.parse(storedLogin) : null);  // Default to null if not set
  });



  // Handlers for Sold Waste Calculation
  const handleSoldWasteChange = (e) => {
    const { name, value } = e.target;
    const updatedSoldWaste = { ...soldWaste, [name]: value };

    if (name === "weight" || name === "pricePerKg") {
      const weight = parseFloat(name === "weight" ? value : soldWaste.weight);
      const pricePerKg = parseFloat(name === "pricePerKg" ? value : soldWaste.pricePerKg);
      updatedSoldWaste.totalPrice = !isNaN(weight) && !isNaN(pricePerKg) ? (weight * pricePerKg).toFixed(2) : "0";
    }
    setSoldWaste(updatedSoldWaste);
  };

  // Toggle Button Change Handler
  const handleToggleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const [paperWasteData, setPaperWasteData] = useState([])
  const [EWasteData, setEWasteData] = useState([])
  const [selledPaperEWasteData, setSelledPaperEWasteData] = useState([])

  const getPaperWaste = async () => {
    try {
      const paper = await getWaste("paperwaste/analytics/")
      if (paper.status === 200)
        setPaperWasteData(paper.data.data)
      // console.log("paper waste:", paper)

      const ewaste = await getWaste("ewaste/analytics/")
      if (ewaste.status === 200)
        setEWasteData(ewaste.data.data)
      // console.log("ewaste waste:", ewaste)

      const soldPaper = await getWaste("selledpaperwaste/analytics/")
      if (soldPaper.status === 200)
        setSelledPaperEWasteData(soldPaper.data.data)
      // console.log("selledpaper waste:", soldPaper)

    } catch (e) {
      console.error("paper error:", e);
    }

  }
  useEffect(() => {
    getPaperWaste()

  }, [paperWaste])

  const handleSubmitPaperWaste = async () => {
    if (paperWaste.weight.trim() !== "" && paperWaste.date !== null) {
      try {

        paperWaste['pincode'] = parseInt(login?.user[0]?.pincode)
        const res = await addWasteData("paperwaste/add-data/", paperWaste)
        console.log(res);
        setPaperWaste({ weight: "", date: "" })

      } catch (e) {
        console.log("error post paper:", e);
      }
    } else {
      console.log("all fields require");

    }

  }

  const handleSubmitEWaste = async () => {
    if (eWaste.model.trim() !== "" && eWaste.date !== null && eWaste.units !== 0) {
      try {
        const data = {
          "pincode": parseInt(login?.user[0]?.pincode),
          "name": eWaste.model,
          "date_time": eWaste.date,
          "no_of_units": eWaste.units

        }

        const res = await addWasteData("ewaste/add-data/", data)
        console.log(res);
        setEWaste({ units: "", model: "", date: "" })


      } catch (e) {
        console.log("error post paper:", e);
      }
    } else {
      console.log("all fields require");
    }}

    const handleSubmitSoldPaperWaste = async () => {
      if (soldWaste.weight.trim() !== "" && soldWaste.date !== null && soldWaste.pricePerKg !== 0) {
        try {
          const data = {
            "pincode": parseInt(login?.user[0]?.pincode),
            "total_price": parseFloat(soldWaste.weight*soldWaste.pricePerKg),
            "date_time": soldWaste.date,
            "selling_price_per_unit": soldWaste.pricePerKg,
            "total_weight": soldWaste.weight
          }
  
          const res = await addWasteData("selledpaperwaste/add-data/", data)
          console.log(res);
          setSoldWaste({ weight: "", pricePerKg: "", totalPrice: "0", date: "" })
  
  
        } catch (e) {
          console.log("error post paper:", e);
        }
      } else {
        console.log("all fields require");
  
      }
  
    }
  return (

    <Box sx={{ padding: "20px" }}>
      {
        login.is_divisional ? "" : <div>


          <Typography variant="h4" sx={{ mb: 4, textAlign: "center", color: theme.palette.primary.main }}>
            Waste Management Entry
          </Typography>
          <Grid container spacing={3}>
            {/* Form 1: Daily Paper Waste */}
            <Grid item xs={12} md={4}>
              <CardStyle>
                <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>
                  Daily Paper Waste Count
                </Typography>
                <TextField
                  label="Total Weight (kg)"
                  type="number"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 3 }}
                  name="weight"
                  onChange={(e) => setPaperWaste({ ...paperWaste, weight: e.target.value })}
                />
                <TextField
                  label="Date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 3 }}
                  name="date"
                  onChange={(e) => setPaperWaste({ ...paperWaste, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <StyledButton onClick={handleSubmitPaperWaste} fullWidth>Submit Paper Waste Entry</StyledButton>
              </CardStyle>
            </Grid>

            {/* Form 2: E-Waste Entry */}
            <Grid item xs={12} md={4}>
              <CardStyle>
                <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>
                  E-Waste Entry
                </Typography>
                <TextField
                  label="No. of Units"
                  type="number"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 3 }}
                  name="units"
                  onChange={(e) => setEWaste({ ...eWaste, units: e.target.value })}
                />
                <TextField
                  label="Model Name"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 3 }}
                  name="model"
                  onChange={(e) => setEWaste({ ...eWaste, model: e.target.value })}
                />
                <TextField
                  label="Date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 3 }}
                  name="date"
                  onChange={(e) => setEWaste({ ...eWaste, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <StyledButton onClick={handleSubmitEWaste} fullWidth>Submit E-Waste Entry</StyledButton>
              </CardStyle>
            </Grid>

            {/* Form 3: Sold Paper Waste */}
            <Grid item xs={12} md={4}>
              <CardStyle>
                <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>
                  Sold Paper Waste (Recycled)
                </Typography>
                <TextField
                  label="Total Weight (kg)"
                  type="number"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 3 }}
                  name="weight"
                  onChange={handleSoldWasteChange}
                />
                <TextField
                  label="Selling Price (Rs./kg)"
                  type="number"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 3 }}
                  name="pricePerKg"
                  onChange={handleSoldWasteChange}
                />
                <TextField
                  label="Total Price (Rs.)"
                  type="number"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 3 }}
                  value={soldWaste.totalPrice}
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label="Date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 3 }}
                  name="date"
                  onChange={(e) => setPaperWaste({ ...paperWaste, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <StyledButton onClick={handleSubmitSoldPaperWaste} fullWidth>Submit Sold Waste Entry</StyledButton>
              </CardStyle>
            </Grid>
          </Grid>
        </div>
      }
      {/* Toggle Buttons */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <ToggleButtonGroup color="primary" value={alignment} exclusive onChange={handleToggleChange}>
          <ToggleButton value="Paper waste">Paper Waste</ToggleButton>
          <ToggleButton value="E waste">E-Waste</ToggleButton>
          <ToggleButton value="Selled waste">Sold Waste</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Table Display */}
      <Box sx={{ mt: 4 }}>
        {alignment === "Paper waste" && (
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Weight</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Pincode</TableCell>
                </TableRow>
                {
                  paperWasteData.map((item, index) => {
                    return <TableRow key={index}>
                      <TableCell>{item.weight} kg</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.pincode}</TableCell>
                    </TableRow>
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {alignment === "E waste" && (
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>No. of Units</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Pincode</TableCell>
                </TableRow>

                {
                  EWasteData.map((item, index) => {
                    return <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.no_of_units}</TableCell>
                      <TableCell>{item.date_time}</TableCell>
                      <TableCell>{item.pincode}</TableCell>
                    </TableRow>
                  })
                }


              </TableBody>
            </Table>
          </TableContainer>
        )}
        {alignment === "Selled waste" && (
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Waste Weight(kg)</TableCell>
                  <TableCell>Total Price (Rs.)</TableCell>
                  <TableCell>Selling Price (Rs./kg)</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Pincode</TableCell>
                </TableRow>
                {selledPaperEWasteData.map((item, index) => {

                  return <TableRow key={index}>
                    <TableCell>{item.total_weight}</TableCell>
                    <TableCell>{item.selling_price_per_unit}</TableCell>
                    <TableCell>{item.total_price}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.pincode}</TableCell>
                  </TableRow>
                })}

              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default WasteManagement;
