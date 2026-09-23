/* Local preview server for the Shree Laxmifeb website.
   Run:  node serve.js
   Then open the address it prints.                        */

const http = require('http'), fs = require('fs'), path = require('path');

const ROOT = path.resolve(__dirname);
const PORT = Number(process.argv[2]) || 5173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css' : 'text/css; charset=utf-8',
  '.js'  : 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.mp4' : 'video/mp4',
  '.webm': 'video/webm',
  '.jpg' : 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png' : 'image/png',
  '.webp': 'image/webp',
  '.svg' : 'image/svg+xml',
  '.ico' : 'image/x-icon',
  '.woff2': 'font/woff2',
  '.md'  : 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/') url = '/index.html';

  const file = path.join(ROOT, url);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<h1 style="font-family:sans-serif">404 &mdash; ' + url + ' not found</h1>');
    }
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  });
});

server.on('error', e => {
  if (e.code === 'EADDRINUSE') {
    console.error('\n  Port ' + PORT + ' is already in use.');
    console.error('  Try another port:   node serve.js 5174\n');
  } else {
    console.error(e.message);
  }
  process.exit(1);
});

server.listen(PORT, () => {
  console.log('\n  SHREE LAXMIFEB — local preview');
  console.log('  --------------------------------');
  console.log('  Open:  http://localhost:' + PORT);
  console.log('  Stop:  press Ctrl + C\n');
});
