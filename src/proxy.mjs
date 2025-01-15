import express from 'express';
import  { atcLinks, sourceURL } from './config.mjs';
import { createProxyMiddleware } from 'http-proxy-middleware';


const setUpProxy = (isVerbose) => {
  console.log(isVerbose)
  const ATCStream = express.Router();

  ATCStream.use('/all', (req, res) => {
    res.status(200).json(Object.keys(atcLinks))
  });

  ATCStream.use('/:airport', (req, res) => {
    const targetUrl = atcLinks[req.params.airport];
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': sourceURL
      },
      on: {
        proxyReq: (proxyReq, req, res) => {
          proxyReq.path = proxyReq.path.replace(/\/$/, '');
          if (isVerbose) {
            console.log('Proxy request initiated');
            console.log(
              `Target: ${proxyReq.getHeader('host') + proxyReq.path}`
            );
          };
        },
        proxyRes: (proxyRes, req, res) => {
          if (isVerbose) {
            console.log('Streaming data...');
            console.log(`Status Code: ${proxyRes.statusCode}`);
            console.log('Response Headers:', proxyRes.headers);
            proxyRes.on('data', (chunk) => {
              console.log(`Received chunk of size: ${chunk.length}`);
            });
            proxyRes.on('close', () => console.log('Connection closed'));
          };
        },
      }
    });
    proxy(req, res);
  });
  return ATCStream;
};

export default setUpProxy;