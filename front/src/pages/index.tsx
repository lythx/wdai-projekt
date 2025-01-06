import { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Box, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Link from 'next/link';
import Navbar from '../app/components/Navbar';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkmode');
    if (savedTheme) {
      setDarkMode(savedTheme === 'true');
    }
  }, []);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products").then(async (res) => {
      const data = await res.json();
      setProducts(data);
      console.log(data);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('darkmode', darkMode.toString());
  }, [darkMode]);

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2', // Custom primary color
      },
      secondary: {
        main: '#dc004e', // Custom secondary color
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9', // Custom primary color
      },
      secondary: {
        main: '#f48fb1', // Custom secondary color
      },
    },
  });

  const theme = darkMode ? darkTheme : lightTheme;

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar darkMode={darkMode} handleThemeToggle={handleThemeToggle} />
      <Container maxWidth="lg">
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Products
          </Typography>
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4}>
                <Link
                  href={{
                    pathname: `/products/${product.id}`,
                    query: { ...product },
                  }}
                  passHref
                >
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                    <CardMedia
                      component="img"
                      height="300"
                      image={product.image}
                      alt={product.title}
                      sx={{ objectFit: 'contain' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="div">
                        {product.title}
                      </Typography>
                      <Typography variant="h6" color="text.primary">
                        ${product.price}
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 2 }}>
                      <Button variant="contained" color="primary" fullWidth>
                        Add to Cart
                      </Button>
                    </Box>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}