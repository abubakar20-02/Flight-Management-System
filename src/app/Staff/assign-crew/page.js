'use client';
import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box, Container, IconButton, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Image from 'next/image';
import crew from '../../../../Resources/CabinCrew.png';

function AddCrewMember() {
    const [formData, setFormData] = useState({
        flightNumber: '',
        crewMemberID: ''
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
        console.log('Form Data:', formData);

        try {
            const response = await fetch('http://localhost:5000/api/flightcrew', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    flightNum: formData.flightNumber,
                    staffID: formData.crewMemberID
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Success:', result);
                setNotification({ open: true, message: result.message, severity: 'success' });
                // Optionally reset form
                setFormData({
                    flightNumber: '',
                    crewMemberID: ''
                });
            } else {
                const error = await response.json();
                console.error('Error:', error);
                setNotification({ open: true, message: error.message, severity: 'error' });
            }
        } catch (error) {
            console.error('Error:', error);
            setNotification({ open: true, message: 'Error adding crew member', severity: 'error' });
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
                            ADD CREW
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
                                        id="crewMemberID"
                                        label="Crew Member ID"
                                        name="crewMemberID"
                                        autoComplete="crew-member-id"
                                        value={formData.crewMemberID}
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
                                    Add Crew Member
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

export default AddCrewMember;
