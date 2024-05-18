'use client';
import React, { useState } from 'react';
import { Grid, Box } from '@mui/material';
import LoginForm from './LoginForm';
import SignUp from './SignUp';
import Image from 'next/image';
import AirPlane from '../../Resources/airplane.png';

function LoginLayout() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleToggleSignUp = () => {
    if (showSignUp) {
      setClosing(true);
      setTimeout(() => {
        setShowSignUp(false);
        setClosing(false);
      }, 500); // Match this duration with your CSS animation duration
    } else {
      setShowSignUp(true);
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh', position: 'relative' }}>
      <Grid item xs={false} sm={4} md={6} sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Box sx={{ position: "absolute", width: "50vw", height: "100%" }}>
          <Image
            alt="Airplane"
            src={AirPlane}
            layout="fill"
            objectFit="cover"
          />
        </Box>
      </Grid>
      <Grid item xs={12} sm={8} md={6} component={Box} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <LoginForm onLogin={() => {}} onSignUp={handleToggleSignUp} />
      </Grid>
      {showSignUp && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: { xs: 0, sm: '50%' },
          width: { xs: '100%', sm: '50%' },
          height: '100%',
          backgroundColor: 'white',
          zIndex: 1201,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          animation: closing ? 'slideOut 0.5s forwards' : 'slideIn 0.5s forwards'
        }}>
          <SignUp onClose={handleToggleSignUp} />
        </Box>
      )}
    </Grid>
  );
}

export default LoginLayout;
