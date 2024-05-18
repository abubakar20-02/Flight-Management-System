'use client';
import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

function LoginForm({ onSignUp }) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const passengerID = Cookies.get('passengerID');
    if (passengerID) {
      if (passengerID === 'admin') {
        router.push('/Staff/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [router]);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (username === 'admin' && password === 'admin') {
      Cookies.set('passengerID', 'admin', { expires: 7 });
      router.push('/Staff/dashboard');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      if (response.ok) {
        setNotification({ open: true, message: result.message, severity: 'success' });
        Cookies.set('passengerID', result.username, { expires: 7 });

        router.push('/dashboard');
      } else {
        setNotification({ open: true, message: result.message, severity: 'error' });
      }
    } catch (error) {
      setNotification({ open: true, message: 'An error occurred. Please try again.', severity: 'error' });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
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
                boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)',
              },
            }}
          >
            Sign In
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={onSignUp}
            sx={{
              flexGrow: 1,
              ml: 1,
              borderColor: 'black',
              color: 'black',
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)',
              },
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default LoginForm;
