import { __dirname } from './config.mjs';
import path from 'path';
import fs from 'fs/promises';


const generateRandomNumber = (maximum) => {
  return Math.floor(Math.random() * maximum)
}

// gets available albums
const getAlbums = async (excluded) => {
  try{
    const albums = await fs.readdir(path.join(__dirname, 'albums'));

    return [...albums].filter(
      album => !excluded.includes(album) && album !== '.DS_Store'
    );
  } catch (error) {
    console.error(`${error}`);
    throw error
  }
}


const getAlbum = async (excluded) => {
  try {
    const albums = await getAlbums(excluded);
    const randomIndex = generateRandomNumber(albums.length)
    const album = albums[randomIndex]
    excluded.push(album)
    const songs = await fs.readdir(path.join(__dirname, 'albums', album));
    return songs.map(song => path.join(__dirname, 'albums', album, song));
  } catch (error) {
    console.error(`${error}`);
    throw error
  }
}

export default getAlbum;