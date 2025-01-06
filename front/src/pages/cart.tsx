import { useEffect, useState } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Divider, Button, Paper, ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import Navbar from '@/app/components/Navbar';

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Item 1', quantity: 2, price: 10 },
    { id: 2, name: 'Item 2', quantity: 1, price: 20 },
    { id: 3, name: 'Item 3', quantity: 3, price: 15 },
  ]);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
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
            Cart
          </Typography>
          <Paper elevation={3} sx={{ p: 2 }}>
            <List>
              {cartItems.map((item) => (
                <div key={item.id}>
                  <ListItem>
                    <ListItemText
                      primary={item.name}
                      secondary={`Quantity: ${item.quantity} - Price: $${item.price}`}
                    />
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">
                Total: ${getTotalPrice()}
              </Typography>
              <Button variant="contained" color="primary">
                Checkout
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
