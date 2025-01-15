import 'dotenv/config';
import path from 'path';



export const secret = process.env.SECRET ? process.env.SECRET : 'abcdefg';
export const __dirname = import.meta.dirname;
export const publicPath = path.join(__dirname, 'public');
export const sessionFolder = path.join(__dirname, 'sessions');
export const port = process.env.PORT ? process.env.PORT : 3030;
export const sourceURL = process.env.ATC_FEED_URL;
export const atcLinks = {
    KJFK: process.env.KJFK,
    KORD: process.env.KORD,
  }