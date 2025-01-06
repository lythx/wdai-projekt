import { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useRouter } from 'next/router';
import Navbar from '@/app/components/Navbar';

export default function Register() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    console.log('1123')
    const headers = new Headers({
      "Content-Type": "application/json",
      'Access-Control-Allow-Origin': "http://localhost:5000",
    })
    fetch("http://localhost:5000/api/register", {
      method: "POST", body: JSON.stringify({
        name: name, surname, email, password
      }), headers
    })
  };

  const handleLoginRedirect = () => {
    // router.push('/login');
  };

  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    setDarkMode(localStorage.getItem("darkmode") === "true")
  }, [])
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  const theme = darkMode ? darkTheme : lightTheme;
  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkmode", !darkMode ? "true" : "false")
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar darkMode={darkMode} handleThemeToggle={handleThemeToggle} />
      <Container maxWidth="sm">
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Register
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Name"
                type="text"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Surname"
                type="text"
                value={surname}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSurname(e.target.value)}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                required
              />
            </Box>
            <Button variant="contained" color="primary" type="submit">
              Register
            </Button>
          </form>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link component="button" variant="body2" onClick={handleLoginRedirect}>
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}