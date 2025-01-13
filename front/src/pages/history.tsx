import { useEffect, useState } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Divider, Paper, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Navbar from '@/app/components/Navbar';
import utils from '@/app/utils/utils';
import { useRouter } from 'next/router';
import { Product } from '@/app/types';


interface Order {
  id: number;
  date: Date;
  items: Product[];
}

export default function History() {
  const [orders, setOrders] = useState<Order[]>([]);

  const getTotalPrice = (items: Product[]): number => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    localStorage.setItem('fallbackUrl', '/history')
    setDarkMode(localStorage.getItem("darkmode") === "true")
    fetch("http://localhost:5000/api/orders", { headers: utils.getHeadersWithToken() }).then(async (res) => {
      if (!res.ok) {
        return
      }
      const data = await res.json();
      setOrders(data)
    });
  }, [])
  const theme = darkMode ? utils.getDarkTheme() : utils.getLightTheme();
  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkmode", !darkMode ? "true" : "false")
  };

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

  if (tokenStatus === "invalid") {
    router.push("/login")
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar darkMode={darkMode} handleThemeToggle={handleThemeToggle} />
      <Container maxWidth="sm">
        {tokenStatus !== "valid" ? <></> :
          <Box sx={{ mt: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Order History
            </Typography>
            {orders.map((order) => (
              <Paper key={order.id} elevation={3} sx={{ p: 2, mb: 4 }}>
                <Typography variant="h6" component="h2">
                  Order #{order.id} - {order.date.toString()}
                </Typography>
                <List>
                  {order.items.map((item) => (
                    <div key={item.id}>
                      <ListItem>
                        <ListItemText
                          primary={item.title}
                          secondary={`Quantity: ${item.quantity} - Price: $${item.price.toFixed(2)}`}
                        />
                      </ListItem>
                      <Divider />
                    </div>
                  ))}
                </List>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">
                    Total: ${getTotalPrice(order.items).toFixed(2)}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>}
      </Container>
    </ThemeProvider>
  );
}
