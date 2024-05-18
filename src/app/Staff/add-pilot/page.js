'use client';
import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box, Container, IconButton, Snackbar, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Image from 'next/image';
import pilot from '../../../../Resources/pilot.png';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function StaffSignUp() {
    const [formData, setFormData] = useState({
        employeeNumber: '',
        rating: ''
    });

    const router = useRouter();

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
        
        const pilotData = {
            staffID: formData.employeeNumber,
            typeRating: formData.rating
        };
        
        console.log(JSON.stringify(pilotData));
        
        try {
            const response = await fetch('http://localhost:5000/api/pilot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pilotData),
            });

            const result = await response.json();
            if (response.ok) {
                setSnackbarSeverity('success');
                setSnackbarMessage('Pilot added successfully!');
                setFormData({ employeeNumber: '', rating: '' });
            } else {
                setSnackbarSeverity('error');
                setSnackbarMessage(result.message || 'Error adding pilot');
            }
        } catch (error) {
            console.error('Error:', error);
            setSnackbarSeverity('error');
            setSnackbarMessage('Error adding pilot');
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleBackClick = () => {
        router.back();
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
                    alt="Airplane"
                    src={pilot}
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
                            ADD PILOT
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="employeeNumber"
                                        label="Employee Number"
                                        name="employeeNumber"
                                        autoComplete="employee-number"
                                        value={formData.employeeNumber}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="rating"
                                        label="Rating"
                                        name="rating"
                                        select
                                        value={formData.rating}
                                        onChange={handleChange}
                                    >
                                        {['A', 'B', 'C', 'D', 'E', 'F'].map((rating) => (
                                            <MenuItem key={rating} value={rating}>
                                                {rating}
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
                                    Add Pilot
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
