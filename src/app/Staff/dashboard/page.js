'use client';
import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import Cookies from 'js-cookie';

import CabinCrew from '../../../../Resources/Dashboard/CabinCrew.png';
import Crew from '../../../../Resources/Dashboard/Crew.png';
import LandingPlane from '../../../../Resources/Dashboard/LandingPlane.png';
import TakOffPlane from '../../../../Resources/Dashboard/TakeOffPlane.png';
import Pilot from '../../../../Resources/Dashboard/Pilot.png';
import Schedule from '../../../../Resources/Dashboard/Schedule.png';
import LandedPlane from '../../../../Resources/Dashboard/LandedPlane.png';
import WayPoints from '../../../../Resources/Dashboard/WayPoints.png';
import Overlay from '../../../../Resources/Dashboard/overlay.png';

const cardData = [
  { id: 1, title: 'Add Flight', image: TakOffPlane, route: '/Staff/add-flight' },
  { id: 2, title: 'Remove Flight', image: LandingPlane, route: '/Staff/remove-flight' },
  { id: 3, title: 'Add Pilot', image: Pilot, route: '/Staff/add-pilot' },
  { id: 4, title: 'Add Staff Member', image: Crew, route: '/Staff/add-staff' },
  { id: 5, title: 'Assign Crew to Flight', image: CabinCrew, route: '/Staff/assign-crew' },
  { id: 6, title: 'View Crew Schedules', image: Schedule, route: '/Staff/view-schedules' },
  { id: 7, title: 'Add Plane', image: LandedPlane, route: '/Staff/add-plane' },
  { id: 8, title: 'Add Intermediate City', image: WayPoints, route: '/Staff/add-city' },
  { id: 9, title: 'Add Flight Overlay', image: Overlay, route: '/Staff/add-flight-overlay' },
];

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: 'auto',
  textAlign: 'center',
}));

const StaffDashboard = () => {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('passengerID');
    router.push('/');
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, marginBottom: 4 }}>
        <Typography variant="h4" sx={{ alignSelf: 'center', fontWeight:'bolder' }}>
          ADMIN
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'darkred' } }}
        >
          Logout
        </Button>
    </Box>
      <Grid container spacing={3} justifyContent="left" alignItems="center">
        {cardData.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.id}>
            <Link href={card.route} passHref legacyBehavior>
              <CardActionArea component="a" sx={{ textDecoration: 'none', color: 'inherit' }}>
                <StyledCard>
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={360}
                    height={180}
                    objectFit="cover"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {card.title}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </CardActionArea>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StaffDashboard;
