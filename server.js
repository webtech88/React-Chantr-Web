const express = require('express');
const next = require('next');

const routes = require('./routes');

const dev = process.env.NODE_ENV !== 'production';

// Load config from .env for dev environment
if (dev) {
  // eslint-disable-next-line global-require
  require('dotenv').config();

  if (!process.env.PORT) {
    /* eslint-disable no-console */
    console.error('Required environment variable not found. Are you sure you have a ".env" file in your application root?');
    console.error('If not, you can just copy "example.env" and change the defaults as per your need.');
    process.exit(1);
    /* eslint-enable no-console */
  }
}

const app = next({ dev });

app.prepare()
.then(() => {
  const server = express();

  server.get('/robots.txt', (req, res) => {
    const options = {
      root: __dirname,
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true,
        'content-type': 'text/plain',
      },
    };
    res.sendFile('robots.txt', options);
  });

  server.use(routes.getRequestHandler(app));
  server.listen(process.env.PORT, (err) => {
    if (err) {
      throw err;
    }

    // eslint-disable-next-line no-console
    console.log(`> Ready on http://localhost:${process.env.PORT}`);
  });
});

process.on('SIGTERM', () => {
 app.close()
  .then(() => {
    console.log('Gracefully stopping...');
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
});
