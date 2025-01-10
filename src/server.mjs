import { port, publicPath, __dirname } from './config.mjs';
import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import archiver from 'archiver';

const app = express();
app.use(express.static(publicPath))


app.get('/get-album', async (req, res) => {
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename: album.zip');

  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  archive.pipe(res);

  try{
    const songs = await fs.readdir(
      path.join(__dirname, 'albums', 'Better-Together')
    );

    songs.forEach(song => {
      archive.file(
        path.join(__dirname, 'albums', 'Better-Together', song), { name: song }
      );
    });
    archive.finalize();
  } catch (err) {
    console.log('Here')

    res.status(500).json({ msg: 'Failed to get album' })
  }

  

}) 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})