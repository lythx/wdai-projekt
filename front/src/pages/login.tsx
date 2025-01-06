import { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useRouter } from 'next/router';
import Navbar from '@/app/components/Navbar';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    console.log('XD')
    const headers = new Headers({
      "Content-Type": "application/json",
      'Access-Control-Allow-Origin': "http://localhost:5000",
    })
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST", body: JSON.stringify({
        email, password
      }), headers
    })
    const data = await res.json()
    console.log(data)
  };

  const handleRegisterRedirect = () => {
    router.push('/register');
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
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
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
            <Button variant="contained" color="primary" type="submit">
              Login
            </Button>
          </form>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link component="button" variant="body2" onClick={handleRegisterRedirect}>
                Register
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}