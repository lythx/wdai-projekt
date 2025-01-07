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

export { validateToken, getHeaders }
