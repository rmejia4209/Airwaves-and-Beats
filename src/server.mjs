import { port, publicPath, __dirname } from './config.mjs';
import getAlbum from './utils.mjs';
import express from 'express';
import session from 'express-session';
import path from 'path';
import archiver from 'archiver';

const app = express();
app.use(express.static(publicPath))


app.use(session({
  secret: 'Roxie',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))


const createSession = (req, res, next) => {
  if (!req.session.played) {
    req.session.played = []
  }
  console.log(req.session.played);
  next();
}


const sendAlbum = async (req, res, next) => {
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename: album.zip');

  const archive = archiver('zip', {
    zlib: { level: 9 }
  });
  archive.pipe(res);

  try {
    const songs = await getAlbum(req.session.played);
    songs.forEach(song => {
      archive.file(song, { name: path.basename(song) });
    });
    archive.finalize();
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get album' });
  }
}


app.get('/get-album', createSession, sendAlbum) 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})