'use client';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../../components/Layout';
import Cookies from 'js-cookie'; // Import js-cookie

const TableHeader = styled(TableCell)(({ theme }) => ({
  backgroundColor: 'black',
  color: 'white',
}));

const Dashboard = () => {
  const [flightData, setFlightData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const passengerID = Cookies.get('passengerID'); // Retrieve passengerID from cookies
      if (!passengerID) {
        console.error('No passengerID found in cookies');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/bookings/${passengerID}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          // Set flightData to the bookings array
          setFlightData(data.bookings);
        } else {
          console.error('Error fetching data:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
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
                <TableHeader>Arrival Time</TableHeader>
                <TableHeader>Departure Time</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {flightData.map((row) => (
                <TableRow key={row.flightNumber}>
                  <TableCell component="th" scope="row">
                    {row.flightNumber}
                  </TableCell>
                  <TableCell>{row.origin}</TableCell>
                  <TableCell>{row.destination}</TableCell>
                  <TableCell>{new Date(row.arrivalTime).toLocaleString()}</TableCell>
                  <TableCell>{new Date(row.departureTime).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Layout>
  );
};

export default Dashboard;
