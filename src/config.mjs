import 'dotenv/config';
import path from 'path';

export const __dirname = import.meta.dirname;
export const publicPath = path.join(__dirname, 'public');
export const port = process.env.PORT ? process.env.PORT : 3030;