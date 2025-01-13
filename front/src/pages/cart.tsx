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
    setCartItems(utils.getCart().map(a => ({ ...a, quantity: Math.min(a.quantity, a.totalQuantity) })))
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
    fetch("http://localhost:5000/api/order", { method: "POST", headers: utils.getHeadersWithToken(), body: JSON.stringify(cartItems.filter(a => a.totalQuantity !== 0)) }).then(async (res) => {
      utils.setCart([])
      router.push('/history')
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
              {cartItems.filter(a => a.totalQuantity !== 0).map((item) => (
                <div key={item.id}>
                  <ListItem>
                    <ListItemText
                      primary={item.title}
                      secondary={`In stock: ${item.totalQuantity} - Price: $${item.price.toFixed(2)}`}
                    />
                    <InputLabel sx={{ minWidth: 80, maxWidth: 80 }} >Quantity:</InputLabel>
                    <Input defaultValue={item.quantity} sx={{ minWidth: 50, maxWidth: 50 }} onChange={(e) => {
                      const newQuantity = Number(e.target.value) ?? 0
                      if (isNaN(newQuantity)) {
                        item.quantity = 1
                      } else if (newQuantity > item.totalQuantity) {
                        item.quantity = item.totalQuantity
                      } else if (newQuantity < 1) {
                        item.quantity = 1
                      } else {
                        item.quantity = newQuantity
                      }
                      e.target.value = String(item.quantity)
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
