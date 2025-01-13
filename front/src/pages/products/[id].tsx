import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Box, Card, CardContent, CardMedia, CssBaseline, Button, List } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from '../../app/components/Navbar';
import utils from '@/app/utils/utils';
import { Product } from '@/app/types';
import Opinion from '@/app/components/Opinion';
import OpinionForm from '@/app/components/OpinionForm';

interface OpinionData {
  id: number
  text: string
  stars: number
  user: number
  name: string
  surname: string
  product: number
}

export default function ProductDetails() {
  const router = useRouter();
  const [id, setId] = useState(NaN)
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState(0)
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [isInCart, setIsInCart] = useState(false)
  const [opinions, setOpinions] = useState<OpinionData[]>([])
  const [user, setUser] = useState<any>(null)

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
    localStorage.setItem('fallbackUrl', `/products/${id}`)
    setId(Number(id))
    fetch(`http://localhost:5000/api/product/${id}`, { headers: utils.getHeaders() }).then(async (res) => {
      if (!res.ok) {
        return
      }
      const data = await res.json();
      setTitle(data.title);
      setPrice(data.price)
      setDescription(data.description)
      setCategory(data.category)
      setImage(data.image)
      setQuantity(data.quantity)
    });
    fetch(`http://localhost:5000/api/opinions/${id}`, { headers: utils.getHeaders() }).then(async (res) => {
      setOpinions(await res.json())
    })
    fetch("http://localhost:5000/api/user", { headers: utils.getHeadersWithToken() }).then(async (res) => {
      if (res.ok) {
        const user = await res.json()
        setUser(user)
      }
    })
  }, [router.isReady]);


  const handleAddToCart = () => {
    const product: Product = {
      id, title, price, description, category, image, quantity: 1, totalQuantity: quantity
    }
    const cart = [...utils.getCart(), product]
    utils.setCart(cart)
    setIsInCart(!isInCart)
  }

  const handleRemoveFromCart = () => {
    const cart = utils.getCart().filter(a => a.id !== id)
    utils.setCart(cart)
    setIsInCart(!isInCart)
  }

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
    localStorage.setItem("darkmode", !darkMode ? "true" : "false")
  };

  const handleOpinionSubmit = (rating: number, text: string) => {
    fetch("http://localhost:5000/api/user", { headers: utils.getHeadersWithToken() }).then(async (userRes) => {
      const user = await userRes.json()
      fetch("http://localhost:5000/api/opinion", {
        headers: utils.getHeadersWithToken(), method: "POST",
        body: JSON.stringify({
          product: id, stars: rating, text, name: user.name, surname: user.surname
        })
      }).then(async (res) => {
        console.log(await res.text())
        fetch(`http://localhost:5000/api/opinions/${id}`, { headers: utils.getHeaders() }).then(async (res) => {
          setOpinions(await res.json())
        })
      })
    })
  }

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

  const handleOpinionDelete = (id: number) => {
    fetch('http://localhost:5000/api/opinion', {
      headers: utils.getHeadersWithToken(),
      body: JSON.stringify({ id }), method: 'delete'
    }).then(() => {
      fetch(`http://localhost:5000/api/opinions/${id}`, { headers: utils.getHeaders() }).then(async (res) => {
        setOpinions(await res.json())
      })
    })
  }

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
                ${price.toFixed(2)}
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
              <Box sx={{ p: 2 }}>
                <Button variant="contained" color="primary" fullWidth
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    !utils.getCart().some(a => a.id === id) ?
                      handleAddToCart() : handleRemoveFromCart()
                  }}
                  sx={{ background: !utils.getCart().some(a => a.id === id) ? '' : '#D84040' }}>
                  {!utils.getCart().some(a => a.id === id) ? "Add to Cart" : "Remove from Cart"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
        {tokenStatus !== 'valid' || opinions.some(a => a.user === user?.id) ? <></> : <OpinionForm onSubmit={handleOpinionSubmit} />}
        <List>
          {opinions.map(a =>
            <Opinion text={a.text} stars={a.stars} name={a.name} surname={a.surname} user={a.user} product={a.product}
              deletable={user?.isAdmin || a.user === user?.id} onDelete={() => handleOpinionDelete(a.id)} />
          )}
        </List>
      </Container>
    </ThemeProvider>
  );
}