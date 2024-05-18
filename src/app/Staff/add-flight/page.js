'use client';
import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box, Container, IconButton, MenuItem, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Image from 'next/image';
import crew from '../../../../Resources/flight-straight.png';

const ukPlaces = [
    'London',
    'Manchester',
    'Liverpool',
    'Birmingham',
    'Leeds',
    'Glasgow',
    'Edinburgh',
    'Bristol',
    'Cardiff',
    'Belfast',
    'Newcastle',
    'Sheffield',
    'Nottingham',
    'Leicester',
    'Brighton',
];

function AddFlight() {
    const [formData, setFormData] = useState({
        flightNumber: '',
        planeSerialNumber: '',
        origin: '',
        destination: '',
        arrivalTime: new Date().toISOString().slice(0, 16),
        departureTime: new Date().toISOString().slice(0, 16),
        pilotId: ''
    });

    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

    const router = useRouter();

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.origin === formData.destination) {
            setNotification({ open: true, message: 'Origin and destination cannot be the same', severity: 'error' });
            return;
        }

        if (new Date(formData.departureTime) >= new Date(formData.arrivalTime)) {
            setNotification({ open: true, message: 'Departure time must be before arrival time', severity: 'error' });
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/flight', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    flightNum: formData.flightNumber,
                    numSer: formData.planeSerialNumber,
                    origin: formData.origin,
                    destination: formData.destination,
                    arrTime: formData.arrivalTime,
                    departureTime: formData.departureTime,
                    pilotID: formData.pilotId
                }),
            });

            if (response.ok) {
                const result = await response.json();
                setNotification({ open: true, message: result.message, severity: 'success' });
                // Optionally reset form
                setFormData({
                    flightNumber: '',
                    planeSerialNumber: '',
                    origin: '',
                    destination: '',
                    arrivalTime: new Date().toISOString().slice(0, 16),
                    departureTime: new Date().toISOString().slice(0, 16),
                    pilotId: ''
                });
            } else {
                const error = await response.json();
                setNotification({ open: true, message: error.message, severity: 'error' });
            }
        } catch (error) {
            setNotification({ open: true, message: 'Error adding flight', severity: 'error' });
        }
    };

    const handleBackClick = () => {
        router.back();
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <IconButton
                onClick={handleBackClick}
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
            <Grid item xs={false} sm={4} md={6} sx={{ position: 'relative' }}>
                <Image
                    alt="Crew"
                    src={crew}
                    layout="fill"
                    objectFit="cover"
                />
            </Grid>
            <Grid item xs={12} sm={8} md={6} component={Box} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Container component="main" maxWidth="sm">
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            ADD FLIGHT
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="flightNumber"
                                        label="Flight Number"
                                        name="flightNumber"
                                        autoComplete="flight-number"
                                        value={formData.flightNumber}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="planeSerialNumber"
                                        label="Plane Serial Number"
                                        name="planeSerialNumber"
                                        autoComplete="plane-serial-number"
                                        value={formData.planeSerialNumber}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        required
                                        fullWidth
                                        id="origin"
                                        label="Origin"
                                        name="origin"
                                        value={formData.origin}
                                        onChange={handleChange}
                                    >
                                        {ukPlaces.map((place) => (
                                            <MenuItem key={place} value={place}>
                                                {place}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        required
                                        fullWidth
                                        id="destination"
                                        label="Destination"
                                        name="destination"
                                        value={formData.destination}
                                        onChange={handleChange}
                                    >
                                        {ukPlaces.map((place) => (
                                            <MenuItem key={place} value={place}>
                                                {place}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="departureTime"
                                        label="Departure Time"
                                        name="departureTime"
                                        type="datetime-local"
                                        InputLabelProps={{ shrink: true }}
                                        value={formData.departureTime}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="arrivalTime"
                                        label="Arrival Time"
                                        name="arrivalTime"
                                        type="datetime-local"
                                        InputLabelProps={{ shrink: true }}
                                        value={formData.arrivalTime}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="pilotId"
                                        label="Pilot ID"
                                        name="pilotId"
                                        autoComplete="pilot-id"
                                        value={formData.pilotId}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, mb: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        flexGrow: 1,
                                        mr: 1,
                                        backgroundColor: 'black',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'black',
                                            boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)'
                                        }
                                    }}
                                >
                                    Add Flight
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Grid>
            <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Grid>
    );
}

export default AddFlight;
