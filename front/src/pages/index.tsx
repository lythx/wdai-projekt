import { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Box, CssBaseline, Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Link from 'next/link';
import Navbar from '../app/components/Navbar';
import utils from '@/app/utils/utils';
import { Product } from '@/app/types';



export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<Product[]>([])

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkmode');
    if (savedTheme) {
      setDarkMode(savedTheme === 'true');
    }
    setCartItems(utils.getCart())
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/products", { headers: utils.getHeaders() }).then(async (res) => {
      const data = await res.json();
      setProducts(data);
      console.log(data);
    });
    fetch("http://localhost:5000/api/categories").then(async (res) => {
      const data = await res.json();
      setCategories(data);
      console.log(data);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('darkmode', darkMode.toString());
  }, [darkMode]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prevSelected =>
      prevSelected.includes(category)
        ? prevSelected.filter(c => c !== category)
        : [...prevSelected, category]
    );
  };
  const filteredProducts = products.filter(product =>
    (selectedCategories.length === 0 || selectedCategories.includes(product.category)) &&
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const theme = darkMode ? utils.getDarkTheme() : utils.getLightTheme()
  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleAddToCart = (product: Product) => {
    const cart = [...cartItems, { ...product, quantity: 1, totalQuantity: product.quantity }]
    setCartItems(cart)
    utils.setCart(cart)
  }

  const handleRemoveFromCart = (product: Product) => {
    const cart = cartItems.filter(a => a.id !== product.id)
    setCartItems(cart)
    utils.setCart(cart)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar darkMode={darkMode} handleThemeToggle={handleThemeToggle} />
      <Container maxWidth="lg">
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Products
          </Typography>
          <TextField
            fullWidth
            label="Search Products"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 4 }}
          />
          <FormGroup row>
            {categories.map(category => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                }
                label={category}
              />
            ))}
          </FormGroup>
          <Grid container spacing={4}>
            {filteredProducts.map((product) => (
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
                      <Typography variant="h6" color="text.primary">
                        In stock: {product.quantity}
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 2 }}>
                      <Button variant="contained" color="primary" fullWidth
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          !cartItems.some(a => a.id === product.id) ?
                            handleAddToCart(product) : handleRemoveFromCart(product)
                        }}
                        sx={{ background: !cartItems.some(a => a.id === product.id) ? '' : '#D84040' }}>
                        {!cartItems.some(a => a.id === product.id) ? "Add to Cart" : "Remove from Cart"}
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