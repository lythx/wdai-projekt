import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Box, Card, CardContent, CardMedia, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from '../../app/components/Navbar';

export default function ProductDetails() {
  const router = useRouter();
  const { id, title, price, description, category, image } = router.query;

  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkmode');
    if (savedTheme) {
      setDarkMode(savedTheme === 'true');
    }
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
      <Container maxWidth="sm">
        <Box sx={{ mt: 8 }}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image={image as string}
              alt={title as string}
              sx={{ objectFit: 'contain' }}
            />
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h6" color="text.primary">
                ${price}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {description}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Category: {category}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </ThemeProvider>
  );
}