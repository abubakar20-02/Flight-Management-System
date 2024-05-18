'use client';
import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Box, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const FlightSearch = () => {
    const router = useRouter();
    const [flightNumber, setFlightNumber] = useState('');
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedRow, setSelectedRow] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

    const fetchData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/flights/search/${flightNumber}`);
            if (response.ok) {
                const data = await response.json();
                setRows(data.flights);
            } else {
                const error = await response.json();
                setNotification({ open: true, message: error.message, severity: 'error' });
                setRows([]);
            }
        } catch (error) {
            setNotification({ open: true, message: 'Error fetching data', severity: 'error' });
            setRows([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRowClick = (rowId) => {
        setSelectedRow(rowId);
    };

    const handleDelete = async () => {
        if (selectedRow !== null) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/flight/${selectedRow}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setRows(rows.filter((row) => row.flightNumber !== selectedRow));
                    setSelectedRow(null);
                    setDeleteDialogOpen(false);
                    setNotification({ open: true, message: 'Flight deleted successfully', severity: 'success' });
                } else {
                    const error = await response.json();
                    setNotification({ open: true, message: error.message, severity: 'error' });
                }
            } catch (error) {
                setNotification({ open: true, message: 'Error deleting flight', severity: 'error' });
            }
        }
    };

    const handleOpenDeleteDialog = () => {
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
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
                Search Flight
            </Typography>
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={8}>
                        <TextField
                            fullWidth
                            id="flightNumber"
                            label="Flight Number"
                            value={flightNumber}
                            onChange={(e) => setFlightNumber(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                height: '56px', // Explicitly set the height to match the text field
                                backgroundColor: 'black',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'black',
                                    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)'
                                }
                            }}
                            onClick={fetchData}
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
                            <TableRow
                                key={row.flightNumber}
                                onClick={() => handleRowClick(row.flightNumber)}
                                sx={{
                                    cursor: 'pointer',
                                    backgroundColor: selectedRow === row.flightNumber ? 'black' : 'inherit',
                                    '& .MuiTableCell-root': {
                                        color: selectedRow === row.flightNumber ? 'white' : 'inherit',
                                    },
                                }}
                            >
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: 'red',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'darkred',
                        }
                    }}
                    onClick={handleOpenDeleteDialog}
                    disabled={selectedRow === null}
                >
                    Delete
                </Button>
            </Box>
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Delete Flight"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to permanently delete this flight? All bookings will be deleted.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} sx={{ color: 'black' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} sx={{ color: 'red' }} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default FlightSearch;
