import http from 'http';
import fs from 'fs/promises';
import path from 'path';

const __dirname = import.meta.dirname
const port = 8080;
const server = http.createServer(async (req, res) => {
  let fp = req.url === '/' ? '/index.html' : req.url;
  const ext = path.extname(fp);
  const contentType = ext === '.css' ? 'text/css' : 'text/html';

  try {
    const payload = await fs.readFile(path.join(__dirname, fp), 'utf8');
    res.writeHead(200, {'Content-Type': contentType});
    res.end(payload);
  } catch (err) {
    console.error(err);
    res.writeHead(500);  // will not work if error occurs after line 9
    res.end('Server Error');
  }
});

server.listen(port, () => {
  console.log(`Server listening on ${port}`);
});


