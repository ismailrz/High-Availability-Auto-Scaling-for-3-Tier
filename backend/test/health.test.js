// Zero-dependency smoke test: boots the server on an ephemeral port,
// hits /health, and asserts a healthy response. Gives CodeBuild's
// buildspec a real `npm test` to run.
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const PORT = 4123;
const server = spawn(process.execPath, [path.join(__dirname, '..', 'src', 'server.js')], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: 'inherit',
});

function fail(message) {
  console.error(`FAIL: ${message}`);
  server.kill();
  process.exit(1);
}

function checkHealth(attemptsLeft) {
  http
    .get(`http://localhost:${PORT}/health`, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        if (res.statusCode !== 200) return fail(`expected 200, got ${res.statusCode}`);
        const json = JSON.parse(body);
        if (json.status !== 'healthy') return fail(`expected status "healthy", got "${json.status}"`);
        console.log('PASS: /health returned 200 with status healthy');
        server.kill();
        process.exit(0);
      });
    })
    .on('error', () => {
      if (attemptsLeft <= 0) return fail('server did not become ready in time');
      setTimeout(() => checkHealth(attemptsLeft - 1), 300);
    });
}

setTimeout(() => checkHealth(10), 300);
