import { useState, useEffect } from 'react';
import { Container, TextField, Button, Box, Typography, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from '../app/components/Navbar';
import utils from '../app/utils/utils';

const theme = createTheme();

export default function Account() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check if the user is logged in
    utils.validateToken().then(isValid => {
      setIsLoggedIn(isValid);
      if (isValid) {
        // Fetch user data from API and set it to state
        // Example:
        // fetchUserData().then(data => setUser(data));
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Update user data via API
    // Example:
    // updateUser(user).then(response => console.log(response));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <Navbar /> */}
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {isLoggedIn ? (
            <>
              <Typography component="h1" variant="h5">
                Account
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={user.name}
                  onChange={handleChange}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={user.email}
                  onChange={handleChange}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={user.password}
                  onChange={handleChange}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Update Account
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography component="h1" variant="h5">
                Please Log In
              </Typography>
              <Button
                variant="contained"
                color="primary"
                href="/login"
                sx={{ mt: 3, mb: 2 }}
              >
                Log In
              </Button>
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}