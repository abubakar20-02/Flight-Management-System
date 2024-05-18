'use client';
import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box, Container, IconButton, Snackbar } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Image from 'next/image';
import airplaneInterior from '../../../../Resources/airplane_interior.png';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function StaffSignUp() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        surname: '',
        salary: '',
        homeAddress: '',
        workAddress: '',
        homeTelephone: '',
        workTelephone: ''
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const staffData = {
            firstName: formData.firstName,
            surname: formData.surname,
            salary: formData.salary,
            homeAddress: formData.homeAddress,
            workAddress: formData.workAddress,
            homePhoneNum: formData.homeTelephone,
            workPhoneNum: formData.workTelephone
        };

        try {
            const response = await fetch('http://localhost:5000/api/staff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(staffData),
            });

            const result = await response.json();
            if (response.ok) {
                setSnackbarSeverity('success');
                setSnackbarMessage('Account created successfully!');
                setFormData({
                    email: '',
                    firstName: '',
                    surname: '',
                    salary: '',
                    homeAddress: '',
                    workAddress: '',
                    homeTelephone: '',
                    workTelephone: ''
                });
            } else {
                setSnackbarSeverity('error');
                setSnackbarMessage(result.message || 'Error creating account');
            }
        } catch (error) {
            console.error('Error:', error);
            setSnackbarSeverity('error');
            setSnackbarMessage('Error creating account');
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
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
                    alt="Airplane"
                    src={airplaneInterior}
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
                            STAFF SIGN UP
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
                                        id="salary"
                                        label="Salary (£)"
                                        name="salary"
                                        autoComplete="salary"
                                        value={formData.salary}
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
                </Container>
            </Grid>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Grid>
    );
}

export default StaffSignUp;
