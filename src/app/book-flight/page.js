'use client';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Box,
  Snackbar,
  Alert,
  Slide,
  TablePagination,
  Typography,
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { styled } from '@mui/material/styles';
import Layout from '../../components/Layout';
import Cookies from 'js-cookie'; // Import js-cookie

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
}));

const TableHeader = styled(TableCell)(({ theme }) => ({
  backgroundColor: 'black',
  color: 'white',
}));

const BookFlight = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [flightData, setFlightData] = useState([]);

  const searchParams = useSearchParams();
  const origin = searchParams.get('departure');
  const destination = searchParams.get('destination');

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const params = new URLSearchParams();
        if (origin) {
          params.append('origin', origin);
        }
        if (destination) {
          params.append('destination', destination);
        }
        const queryString = params.toString();
        const url = queryString ? `http://127.0.0.1:5000/api/flights?${queryString}` : `http://127.0.0.1:5000/api/flights`;

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setFlightData(data.flights); // assuming the API returns a "flights" array
        } else {
          console.error('Error fetching flight data:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchFlights();
  }, [origin, destination]);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleRowClick = (row) => {
    setSelectedFlight(row);
  };

  const handleBookClick = async () => {
    const passengerID = Cookies.get('passengerID'); // Get passengerID from cookies
    if (selectedFlight && passengerID) {
      const bookingData = {
        passengerID,
        flightNum: selectedFlight.flightNumber,
      };

      try {
        const response = await fetch('http://127.0.0.1:5000/api/booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        });

        if (response.ok) {
          setSnackbarOpen(true);
        } else {
          console.error('Error booking flight:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Flights
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableHeader>Flight Number</TableHeader>
                  <TableHeader>Origin</TableHeader>
                  <TableHeader>Destination</TableHeader>
                  <TableHeader>Departure Time</TableHeader>
                  <TableHeader>Arrival Time</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {flightData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow
                    key={row.flightNumber}
                    onClick={() => handleRowClick(row)}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: selectedFlight?.flightNumber === row.flightNumber ? 'black' : 'inherit',
                      '& .MuiTableCell-root': {
                        color: selectedFlight?.flightNumber === row.flightNumber ? 'white' : 'inherit',
                      },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.flightNumber}
                    </TableCell>
                    <TableCell>{row.origin}</TableCell>
                    <TableCell>{row.destination}</TableCell>
                    <TableCell>{new Date(row.departureTime).toLocaleString()}</TableCell>
                    <TableCell>{new Date(row.arrivalTime).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={flightData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
          <Button
            variant="contained"
            onClick={handleBookClick}
            sx={{
              mt: 2,
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {
                backgroundColor: 'black',
                boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)',
              },
            }}
            disabled={!selectedFlight}
          >
            Book
          </Button>
        </Box>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Booking Confirmed
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default BookFlight;
