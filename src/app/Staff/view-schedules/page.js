'use client';
import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, IconButton, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CrewSearch = () => {
    const router = useRouter();
    const [crewId, setCrewId] = useState('');
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/flightcrew/${crewId}`);
            if (response.ok) {
                const data = await response.json();
                setRows(data.flights);
                setNotification({ open: true, message: 'Data fetched successfully', severity: 'success' });
            } else {
                const error = await response.json();
                console.error('Error fetching data:', response.statusText);
                setRows([]); // Clear rows if there's an error
                setNotification({ open: true, message: error.message || 'Error fetching data', severity: 'error' });
            }
        } catch (error) {
            console.error('Error:', error);
            setRows([]); // Clear rows if there's an error
            setNotification({ open: true, message: 'Error fetching data', severity: 'error' });
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
            <IconButton
                onClick={() => router.back()}
                sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    zIndex: 1000,
                    backgroundColor: 'white',
                    '&:hover': {
                        backgroundColor: 'white',
                    },
                }}
            >
                <ArrowBackIcon />
            </IconButton>
            <Typography component="h1" variant="h5" gutterBottom>
                Search Crew
            </Typography>
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={8}>
                        <TextField
                            fullWidth
                            id="crewId"
                            label="Crew ID Number"
                            value={crewId}
                            onChange={(e) => setCrewId(e.target.value)}
                            sx={{ height: '56px' }} // Adjust the height if necessary
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleSearch}
                            sx={{
                                height: '56px', // Same height as the TextField
                                backgroundColor: 'black',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'black',
                                },
                            }}
                        >
                            Search
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>Flight Number</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>Origin</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>Destination</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>Departure Time</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>Arrival Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                            <TableRow key={row.flightNumber}>
                                <TableCell>{row.flightNumber}</TableCell>
                                <TableCell>{row.origin}</TableCell>
                                <TableCell>{row.destination}</TableCell>
                                <TableCell>{new Date(row.departureTime).toLocaleString()}</TableCell>
                                <TableCell>{new Date(row.arrivalTime).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CrewSearch;
