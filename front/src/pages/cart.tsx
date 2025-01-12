import { useEffect, useState } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Divider, Button, Paper, ThemeProvider, CssBaseline, createTheme, Input, InputLabel } from '@mui/material';
import Navbar from '@/app/components/Navbar';
import utils from '@/app/utils/utils';
import { Product } from '@/app/types';
import { Label } from '@mui/icons-material';
import { useRouter } from 'next/router';
import DeleteIcon from '@mui/icons-material/Delete'

export default function Cart() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
  }

  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    setDarkMode(localStorage.getItem("darkmode") === "true")
    setCartItems(utils.getCart())
  }, [])
  const theme = darkMode ? utils.getDarkTheme() : utils.getLightTheme();
  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkmode", !darkMode ? "true" : "false")
  };

  const handleOrder = async () => {
    if (cartItems.length === 0) {
      return
    }
    const isTokenValid = await utils.validateToken()
    if (!isTokenValid) {
      router.push('/login')
      return
    }
    fetch("http://localhost:5000/api/order", { method: "POST", headers: utils.getHeaders(), body: JSON.stringify(cartItems) }).then(async (res) => {
      router.push('/')
    });
  }

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
                      primary={item.title}
                      secondary={`In stock: ${item.totalQuantity} - Price: $${item.price.toFixed(2)}`}
                    />
                    <InputLabel sx={{ minWidth: 80, maxWidth: 80 }} >Quantity:</InputLabel>
                    <Input defaultValue={item.quantity} sx={{ minWidth: 50, maxWidth: 50 }} onChange={(e) => {
                      item.quantity = Number(e.target.value) ?? 0
                      utils.setCart([...cartItems])
                      setCartItems([...cartItems])
                    }} />
                    <DeleteIcon sx={{ ml: 2, cursor: 'pointer' }} onClick={() => {
                      const cart = cartItems.filter(a => a.id !== item.id)
                      utils.setCart(cart)
                      setCartItems(cart)
                    }} />
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">
                Total: ${getTotalPrice().toFixed(2)}
              </Typography>
              <Button variant="contained" color="primary" onClick={handleOrder}>
                Order
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
