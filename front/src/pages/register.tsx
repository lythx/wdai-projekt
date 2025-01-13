import { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useRouter } from 'next/router';
import Navbar from '@/app/components/Navbar';
import utils from '@/app/utils/utils';

export default function Register() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState('')

  const router = useRouter()

  const handleRegister = async () => {
    const headers = new Headers({
      "Content-Type": "application/json",
      'Access-Control-Allow-Origin': "http://localhost:5000",
    })
    const registerRes = await fetch("http://localhost:5000/api/register", {
      method: "POST", body: JSON.stringify({
        name: name, surname, email, password
      }), headers
    })
    if (!registerRes.ok) {
      const error = await registerRes.text()
      if (error === "User already exists") {
        setRegisterError(error)
      } else {
        setRegisterError("Failed to create user")
      }
      return
    }
    router.push('/login')
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    setDarkMode(localStorage.getItem("darkmode") === "true")
  }, [])
  const theme = darkMode ? utils.getDarkTheme() : utils.getLightTheme()
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
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Surname"
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Box>
          <Button variant="contained" color="primary" type="submit" onClick={handleRegister}>
            Register
          </Button>
          <Typography sx={{ mt: 2 }} variant="body2" color={"red"}>{registerError}</Typography>
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