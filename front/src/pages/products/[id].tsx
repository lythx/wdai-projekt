import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Box, Card, CardContent, CardMedia, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from '../../app/components/Navbar';
import utils from '@/app/utils/utils';

export default function ProductDetails() {
  const router = useRouter();
  const [id, setId] = useState(NaN)
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState(0)
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState('')
  const [quantity, setQuantity] = useState('')
  const [fetchCompleted, setFetchCompleted] = useState(false)

  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    const savedTheme = localStorage.getItem('darkmode');
    if (savedTheme) {
      setDarkMode(savedTheme === 'true');
    }
    const { id } = router.query;
    setId(Number(id))
    fetch(`http://localhost:5000/api/product/${id}`, { headers: utils.getHeaders() }).then(async (res) => {
      const data = await res.json();
      setTitle(data.title);
      setPrice(data.price)
      setDescription(data.description)
      setCategory(data.category)
      setImage(data.image)
      setQuantity(data.quantity)
      setFetchCompleted(true)
    });
  }, [router.isReady]);

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
              <Typography variant="h6" color="text.primary">
                In stock: {quantity}
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