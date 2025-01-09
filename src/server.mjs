import http from 'http';
import fs from 'fs/promises';
import foo from 'fs';
import path from 'path';

const __dirname = import.meta.dirname
const port = 8080;


const getPayloadInfo = (req) => {
  let fp = null, encoding = null, contentType = null
  switch (req.url) {
    case '/style.css':
      fp = 'style.css';
      encoding = 'utf8'
      contentType = 'text/css'
      break;
    case '/audio.mp3':
      fp = 'audio.mp3';
      contentType = 'audio/mp3'
      break;
    default:
      fp = 'index.html';
      encoding = 'utf8'
      contentType = 'text/html'
  }
  return {fp: path.join(__dirname, fp), encoding, contentType}
}

const sendAudio = async (audio, res) => {
  console.log(audio.fp);
  try {
    const stat = await fs.stat(audio.fp)

    res.writeHead(200, {
      'Content-Type': audio.contentType,
      'Content-Length': stat.size
    });
    const readStream = foo.createReadStream(audio.fp);
    readStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.writeHead(500);
    res.end('Error reading audio file');
  }
}

const server = http.createServer(async (req, res) => {

  const file = getPayloadInfo(req);
  if (file.encoding === null) {
    sendAudio(file, res);
  }
  else {
    try {
      const payload = await fs.readFile(file.fp, file.encoding);
      res.writeHead(200, {'Content-Type': file.contentType});
      res.end(payload);
    } catch (err) {
      console.error(err);
      res.writeHead(500);  // will not work if error occurs after line 9
      res.end('Server Error');
    }
  }
  
});

server.listen(port, () => {
  console.log(`Server listening on ${port}`);
});


