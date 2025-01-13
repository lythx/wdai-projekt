import { useState, useEffect } from 'react';
import { Container, TextField, Button, Box, Typography, CssBaseline, Paper, List } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from '../app/components/Navbar';
import utils from '../app/utils/utils';
import { useRouter } from 'next/router';

interface User {
  name: string,
  surname: string,
  email: string,
}

export default function Account() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/user", { headers: utils.getHeadersWithToken() }).then(async (res) => {
      if (!res.ok) {
        return
      }
      const data = await res.json()
      console.log(data)
      setUser(data)
    }, (err) => {
      console.log(err)
    })
  }, []);

  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    setDarkMode(localStorage.getItem("darkmode") === "true")
  }, [])
  const theme = darkMode ? utils.getDarkTheme() : utils.getLightTheme();
  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkmode", !darkMode ? "true" : "false")
  };

  const handleLogout = () => {
    fetch("http://localhost:5000/api/logout", { headers: utils.getHeadersWithToken(), method: 'POST' }).then(async (res) => {
      router.push('/')
    }, (err) => {
      console.log(err)
    })
  }

  const [tokenStatus, setTokenStatus] = useState<"valid" | "invalid" | "waiting">("waiting")
  useEffect(() => {
    utils.validateToken().then((isValid) => {
      if (isValid) {
        setTokenStatus("valid")
      } else {
        setTokenStatus("invalid")
      }
    })
  }, [])
  const router = useRouter()

  console.log(tokenStatus)
  if (tokenStatus === "invalid") {
    router.push("/login")
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar darkMode={darkMode} handleThemeToggle={handleThemeToggle} />
      <Container maxWidth="sm">
        {tokenStatus !== "valid" || user === null ? <></> :
          <Box sx={{ mt: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Account
            </Typography>
            <Paper elevation={3} sx={{ p: 2, pt: 0.5 }}>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Name: {user.name}
                </Typography>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Surname: {user.surname}
                </Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Email: {user.email}
                </Typography>
                <Button variant="contained" color="primary" onClick={handleLogout} sx={{ width: '50%', alignSelf: 'center' }}>
                  Logout
                </Button>
              </Box>
            </Paper>
          </Box>
        }
      </Container>
    </ThemeProvider>
  );
}