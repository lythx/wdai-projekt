import { useEffect, useState } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Divider, Paper, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Navbar from '@/app/components/Navbar';
import { validateToken } from '@/app/utils/validate-token';
import { useRouter } from 'next/router';

interface Item {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  date: string;
  items: Item[];
}

export default function History() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      date: '2023-10-01',
      items: [
        { id: 1, name: 'Item 1', quantity: 2, price: 10 },
        { id: 2, name: 'Item 2', quantity: 1, price: 20 },
      ],
    },
    {
      id: 2,
      date: '2023-10-05',
      items: [
        { id: 3, name: 'Item 3', quantity: 3, price: 15 },
        { id: 4, name: 'Item 4', quantity: 1, price: 25 },
      ],
    },
  ]);

  const getTotalPrice = (items: Item[]): number => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
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

  const [tokenStatus, setTokenStatus] = useState<"valid" | "invalid" | "waiting">("waiting")
  useEffect(() => {
    validateToken().then((isValid) => {
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
                  Order #{order.id} - {order.date}
                </Typography>
                <List>
                  {order.items.map((item) => (
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
                    Total: ${getTotalPrice(order.items)}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>}
      </Container>
    </ThemeProvider>
  );
}
