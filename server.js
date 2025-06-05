const { createServer: createHttpsServer } = require('https')
const { createServer: createHttpServer } = require('http')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'
const hostname = dev ? 'localhost' : '0.0.0.0'
const port = dev ? 3001 : 3000
const useHttps = dev

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// HTTPS options for development
const httpsOptions = useHttps ? {
  key: fs.readFileSync(path.join(__dirname, 'localhost-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'localhost.pem')),
} : null

const requestHandler = async (req, res) => {
  try {
    const parsedUrl = parse(req.url, true)
    await handle(req, res, parsedUrl)
  } catch (err) {
    console.error('Error occurred handling', req.url, err)
    res.statusCode = 500
    res.end('internal server error')
  }
}

app.prepare().then(() => {
  const server = useHttps 
    ? createHttpsServer(httpsOptions, requestHandler)
    : createHttpServer(requestHandler)
    
  server.listen(port, hostname, (err) => {
    if (err) throw err
    const protocol = useHttps ? 'https' : 'http'
    console.log(`> Ready on ${protocol}://${hostname}:${port}`)
  })
}) 