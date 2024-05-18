'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import Cookies from 'js-cookie';

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
}));

const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
}));

const Navbar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'black',
}));

const FooterBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  backgroundColor: 'black',
  color: 'white',
}));

const ResponsiveNavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleLogout = () => {
    Cookies.remove('passengerID'); // Remove the passengerID cookie
    router.push('/'); // Navigate to the homepage
  };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button onClick={() => handleNavigation('/dashboard')}>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/browse-flight')}>
          <ListItemText primary="Browse Flight" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
      <Divider />
    </Box>
  );

  return (
    <Root>
      <Navbar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Title variant="h6" sx={{ display: { xs: 'none', md: 'block' } }}>
            FLIGHT BOOKING SYSTEM
          </Title>
          <Button color="inherit" sx={{ display: { xs: 'none', md: 'block' } }} onClick={() => handleNavigation('/dashboard')}>
            Dashboard
          </Button>
          <Button color="inherit" sx={{ display: { xs: 'none', md: 'block' } }} onClick={() => handleNavigation('/browse-flight')}>
            Browse Flight
          </Button>
          <Button color="inherit" sx={{ display: { xs: 'none', md: 'block' } }} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </Navbar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </Root>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <FooterBox>
      © {currentYear} No rights reserved.
    </FooterBox>
  );
};

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column'}}>
      <ResponsiveNavbar />
      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight:'100vh'}}>
        {children}
      </Box>
      <Footer />
    </div>
  );
};

export default Layout;
