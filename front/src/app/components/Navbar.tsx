import { AppBar, Toolbar, IconButton, Button, Box, Typography } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import utils from '../utils/utils';

interface NavbarProps {
  darkMode: boolean;
  handleThemeToggle: () => void;
}

export default function Navbar({ darkMode, handleThemeToggle }: NavbarProps) {
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    utils.validateToken().then((isValid) => {
      setLoggedIn(isValid)
    })
  })


  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant='h4'>
          FakeStore
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button color="inherit" onClick={() => router.push('/')}>Shop</Button>
        <Button color="inherit" onClick={() => router.push('/cart')}>Cart</Button>
        <Button color="inherit" onClick={() => router.push('/history')}>History</Button>
        <Button color="inherit" onClick={() => router.push('/account')}>{loggedIn ? "Account" : "Log In"}</Button>
        <IconButton color="inherit" onClick={handleThemeToggle}>
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}