import { createTheme } from "@mui/material"
import { Product } from "../types"

const tokenHeaderKey = "token"

async function validateToken(): Promise<boolean> {
  const cookie = document.cookie.split(";").find(a => a.startsWith("token="))
  if (cookie === undefined) {
    return false
  }
  const token = cookie.split("=")[1]
  const headers = getHeaders()
  headers.set(tokenHeaderKey, token)
  const res = await fetch("http://localhost:5000/api/validate", {
    method: "POST",
    headers
  })
  return res.ok
}

function getHeaders() {
  return new Headers({
    "Content-Type": "application/json",
    'Access-Control-Allow-Origin': "http://localhost:5000",
  })
}

function getHeadersWithToken() {
  const cookie = document.cookie.split(";").find(a => a.startsWith("token="))
  if (cookie === undefined) {
    return getHeaders()
  }
  const token = cookie.split("=")[1]
  const headers = getHeaders()
  headers.set(tokenHeaderKey, token)
  return headers
}

function getCart(): Product[] {
  if (!global.localStorage) {
    return []
  }
  const cart = localStorage.getItem("cart")
  if (cart == null) {
    return []
  }
  return JSON.parse(cart)
}

function setCart(cart: Product[]) {
  localStorage.setItem("cart", JSON.stringify(cart))
}

function getLightTheme() {
  return createTheme({
    palette: {
      mode: 'light',
    },
  });
}

function getDarkTheme() {
  return createTheme({
    palette: {
      mode: 'dark',
    },
  });
}

function setTokenCookie(token: string) {
  document.cookie = `token=${token}; expires=${new Date(Date.now() + 1000 * 60 * 60)}; path=/`
}

export default { validateToken, getHeaders, getCart, setCart, getLightTheme, getDarkTheme, setTokenCookie, getHeadersWithToken }
