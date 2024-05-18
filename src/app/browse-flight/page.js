'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Grid, Typography, Box, Container, Autocomplete } from '@mui/material';
import Image from 'next/image';
import flight from '../../../Resources/flight.png';
import Layout from '../../components/Layout';

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

function SearchFlight() {
    const [formData, setFormData] = useState({
        departure: '',
        destination: ''
    });

    const router = useRouter();

    const handleChange = (event, value, reason, name) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form Data:', formData);

        // Create query parameters from non-empty form data
        const params = new URLSearchParams();
        if (formData.departure) {
            params.append('departure', formData.departure);
        }
        if (formData.destination) {
            params.append('destination', formData.destination);
        }

        // Navigate to the book-flight page with query parameters
        const queryString = params.toString();
        const url = queryString ? `/book-flight?${queryString}` : '/book-flight';
        router.push(url);
    };

    return (
        <Layout>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <Grid item xs={false} sm={4} md={6} sx={{ position: 'relative' }}>
                    <Image
                        alt="Airplane"
                        src={flight}
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
                                BOOK A FLIGHT
                            </Typography>
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Autocomplete
                                            options={ukPlaces}
                                            getOptionLabel={(option) => option}
                                            onChange={(event, value, reason) => handleChange(event, value, reason, 'departure')}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    required
                                                    fullWidth
                                                    id="departure"
                                                    label="Departure"
                                                    name="departure"
                                                    autoComplete="departure"
                                                    value={formData.departure}
                                                    onChange={(event) => handleChange(event, event.target.value, null, 'departure')}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Autocomplete
                                            options={ukPlaces}
                                            getOptionLabel={(option) => option}
                                            onChange={(event, value, reason) => handleChange(event, value, reason, 'destination')}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    required
                                                    fullWidth
                                                    id="destination"
                                                    label="Destination"
                                                    name="destination"
                                                    autoComplete="destination"
                                                    value={formData.destination}
                                                    onChange={(event) => handleChange(event, event.target.value, null, 'destination')}
                                                />
                                            )}
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
                                        Search Flights
                                    </Button>
                                </Box>
                                <Typography variant="body2" color="textSecondary" align="center">
                                    If you leave any field empty, all flights for that place will be shown.
                                </Typography>
                            </Box>
                        </Box>
                    </Container>
                </Grid>
            </Grid>
        </Layout>
    );
}

export default SearchFlight;
