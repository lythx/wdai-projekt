import { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useRouter } from 'next/router';
import Navbar from '@/app/components/Navbar';
import { getHeaders } from '@/app/utils/validate-token';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('')
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST", body: JSON.stringify({
        email, password
      }), headers: getHeaders()
    })
    if (!res.ok) {
      setLoginError("Wrong password or username")
      return
    }
    const data = await res.json()
    document.cookie = `token=${data.token}; expires=${new Date(Date.now() + 1000 * 60 * 60)}; path=/`
  }

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
          <Button variant="contained" color="primary" type="submit" onClick={handleLogin}>
            Login
          </Button>
          <Typography sx={{ mt: 2 }} variant="body2" color={"red"}>{loginError}</Typography>
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