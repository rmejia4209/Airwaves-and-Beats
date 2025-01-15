import archiver from 'archiver';
import express from 'express';
import session from 'express-session';
import FileStore from 'session-file-store';

import { port, publicPath, secret, sessionFolder } from './config.mjs';
import setUpProxy from './proxy.mjs';
import getAlbum from './utils.mjs';



const isVerbose = process.argv.includes('--verbose');
const ATCStream = setUpProxy(isVerbose);
const store = FileStore(session);
const app = express();

app.use(express.static(publicPath))
app.use(session({
  store: new store({
    path: sessionFolder,
    ttl: 60*60*2,  // 2 hours
    reapInterval: 60*60*2,  // session deletion interval
  }),
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 2*60*60*1000, rolling: true}
}))


const createSession = (req, res, next) => {
  if (!req.session.played) {
    req.session.played = []
  }
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
    songs.forEach(song => archive.file(song.path, { name: song.name }));
    archive.finalize();
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get album' });
  }
}


app.get('/get-album', createSession, sendAlbum) 

app.use('/select-airport', ATCStream);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})