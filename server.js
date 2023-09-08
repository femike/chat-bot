const fs = require('fs');
const http = require('http');
const httpProxy = require('http-proxy');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 8080

const origins = [
  'https://dariabatiuk.github.io',
  'https://chat-bot-sandy-six.vercel.app'
]

// Create a proxy server
const proxy = httpProxy.createProxyServer({ changeOrigin: true });

//Proxy request options
const proxyOptions = {
  target: 'https://api.openai.com',
  secure: true,
  changeOrigin: true,
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`
  }
};

const headers = {
  'Access-Control-Request-Method': '*',
  'Access-Control-Request-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Origin'
}

// Create server
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    return fs.readFile('index.html', (err, html) => {
      if (err) {
        return res.writeHead(500).end('500: Server Error')
      } else {
        return res.writeHead(200, {
          'Content-Length': Buffer.byteLength(html),
          'Content-Type': 'text/html'
        }).end(html)
      }
    })
  } else if (fs.existsSync(__dirname + req.url)) {
    return fs.readFile(__dirname + req.url, (err, data) => {
      if (err) {
        return res.writeHead(404, { 'Content-Type': 'text/html' }).end('404: File Not Found')
      } else {
        return res.writeHead(200, {
          'Content-Length': Buffer.byteLength(data),
        }).end(data)
      }
    })
  }

  if (req.headers.origin !== 'null') {
    if (origins.includes(req.headers.origin)) {
      headers['Access-Control-Allow-Origin'] = req.headers.origin
    }

    if (req.method === 'OPTIONS') {
      return res.writeHead(204, headers).end()
    }
  }

  Object.entries(headers).forEach(([name, val]) => res.setHeader(name, val))

  return proxy.web(req, res, proxyOptions)
});

server.listen(PORT, () => console.log(`Proxy api.openapi.com listen: ${PORT}`));
