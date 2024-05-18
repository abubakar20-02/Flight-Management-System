'use client';
import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box, Container, IconButton, MenuItem, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Image from 'next/image';
import crew from '../../../../Resources/Plane.png';

function StaffSignUp() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        serialNumber: '',
        manufacturer: '',
        modelNumber: '',
        typeRating: ''
    });
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { serialNumber, manufacturer, modelNumber, typeRating } = formData;

        console.log(JSON.stringify({ serialNumber, manufacturer, modelNumber, typeRating }));
        const response = await fetch('http://127.0.0.1:5000/api/airplanes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ serialNumber, manufacturer, modelNumber, typeRating }),
        });

        const result = await response.json();
        if (response.ok) {
            setNotification({ open: true, message: result.message, severity: 'success' });
        } else {
            setNotification({ open: true, message: result.message, severity: 'error' });
        }
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
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
                            ADD AIRCRAFT
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="serialNumber"
                                        label="Serial Number"
                                        name="serialNumber"
                                        autoComplete="serial-number"
                                        value={formData.serialNumber}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="manufacturer"
                                        label="Manufacturer"
                                        name="manufacturer"
                                        autoComplete="manufacturer"
                                        value={formData.manufacturer}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="modelNumber"
                                        label="Model Number"
                                        name="modelNumber"
                                        autoComplete="model-number"
                                        value={formData.modelNumber}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        select
                                        id="typeRating"
                                        label="Type Rating"
                                        name="typeRating"
                                        value={formData.typeRating}
                                        onChange={handleChange}
                                    >
                                        {['A', 'B', 'C', 'D', 'E', 'F'].map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
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
                                    Add Aircraft
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

export default StaffSignUp;
