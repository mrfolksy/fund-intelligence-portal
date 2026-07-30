// Custom Node.js server used to run this Next.js app as a Databricks App.
//
// Databricks Apps does not run the app.yaml `command` inside a shell, so shell-style
// environment variable expansion (e.g. `$PORT`) does not work there. Environment
// variables such as DATABRICKS_APP_PORT are still available on `process.env` though,
// so we read the port directly in Node and bind explicitly to 0.0.0.0 so the app is
// reachable from outside the container.
const { createServer } = require('http');
const next = require('next');

const port = parseInt(
  process.env.DATABRICKS_APP_PORT || process.env.PORT || '3000',
  10
);
const hostname = '0.0.0.0';
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      handle(req, res);
    }).listen(port, hostname, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
  });