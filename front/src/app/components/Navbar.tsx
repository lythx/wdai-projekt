import { AppBar, Toolbar, IconButton, Button, Box } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useRouter } from 'next/router';

interface NavbarProps {
  darkMode: boolean;
  handleThemeToggle: () => void;
}

export default function Navbar({ darkMode, handleThemeToggle }: NavbarProps) {
  const router = useRouter();

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <Button color="inherit" onClick={() => router.push('/')}>Sklep</Button>
        <Button color="inherit" onClick={() => router.push('/cart')}>Koszyk</Button>
        <Button color="inherit" onClick={() => router.push('/history')}>Historia</Button>
        <Button color="inherit" onClick={() => router.push('/account')}>Konto</Button>
        <IconButton color="inherit" onClick={handleThemeToggle}>
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}