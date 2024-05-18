'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Grid, Typography, Box, Container, IconButton, Snackbar, Alert } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Cookies from 'js-cookie';

function SignUp({ onClose }) {
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        surname: '',
        homeAddress: '',
        workAddress: '',
        homeTelephone: '',
        workTelephone: '',
        password: '',
        confirmPassword: ''
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

        if (formData.password !== formData.confirmPassword) {
            setNotification({ open: true, message: 'Passwords do not match', severity: 'error' });
            return;
        }

        const passengerData = {
            username: formData.username,
            firstName: formData.firstName,
            surname: formData.surname,
            password: formData.password,
            homeAddress: formData.homeAddress,
            workAddress: formData.workAddress,
            homePhoneNumber: formData.homeTelephone,
            workPhoneNumber: formData.workTelephone
        };
        console.log(JSON.stringify(passengerData));

        try {
            const response = await fetch('http://localhost:5000/api/passenger', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(passengerData),
            });

            const result = await response.json();
            if (response.ok) {
                setNotification({ open: true, message: result.message, severity: 'success' });
                Cookies.set('passengerID', result.id, { expires: 7 });

                // Redirect to /dashboard on successful account creation
                router.push('/dashboard');
            } else {
                setNotification({ open: true, message: result.message, severity: 'error' });
            }
        } catch (error) {
            setNotification({ open: true, message: 'An error occurred', severity: 'error' });
        }
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    return (
        <Container component="main" maxWidth="md" sx={{ position: 'relative' }}>
            <Box
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                }}
            >
                <IconButton onClick={onClose}>
                    <ArrowForwardIcon />
                </IconButton>
            </Box>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="surname"
                                label="Surname"
                                name="surname"
                                autoComplete="family-name"
                                value={formData.surname}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="homeAddress"
                                label="Home Address"
                                name="homeAddress"
                                autoComplete="home address"
                                value={formData.homeAddress}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="workAddress"
                                label="Work Address"
                                name="workAddress"
                                autoComplete="work address"
                                value={formData.workAddress}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="homeTelephone"
                                label="Home Telephone"
                                name="homeTelephone"
                                autoComplete="tel"
                                value={formData.homeTelephone}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="workTelephone"
                                label="Work Telephone"
                                name="workTelephone"
                                autoComplete="tel"
                                value={formData.workTelephone}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Re-enter Password"
                                type="password"
                                id="confirmPassword"
                                autoComplete="new-password"
                                value={formData.confirmPassword}
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
                            Create Account
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default SignUp;
