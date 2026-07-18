const express = require('express');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_VERSION = process.env.APP_VERSION || '1.0.0';
// Lets curl/screenshots prove *which* EC2 instance answered a request
// (used for Blue/Green and auto-deploy-to-new-instance demos).
const INSTANCE_HOSTNAME = os.hostname();

app.use(express.json());

// Simple in-memory data so the API has more than one endpoint to demo.
let items = [
  { id: 1, name: 'Sample Item 1' },
  { id: 2, name: 'Sample Item 2' },
];
let nextId = 3;

// Health check endpoint: used by the ALB Target Group health check AND
// the ASG health check. Must stay dependency-free (no DB) so a DB outage
// can't cause a false-positive cascading instance replacement.
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    version: APP_VERSION,
    host: INSTANCE_HOSTNAME,
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Dedicated version endpoint for Blue/Green and auto-deploy screenshots:
// curl the ALB DNS repeatedly and show version/host flip between deploys.
app.get('/version', (req, res) => {
  res.status(200).json({
    version: APP_VERSION,
    host: INSTANCE_HOSTNAME,
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Backend API is running',
    version: APP_VERSION,
    host: INSTANCE_HOSTNAME,
  });
});

app.get('/api/items', (req, res) => {
  res.status(200).json({ items, servedBy: INSTANCE_HOSTNAME, version: APP_VERSION });
});

app.get('/api/items/:id', (req, res) => {
  const item = items.find((i) => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.status(200).json(item);
});

app.post('/api/items', (req, res) => {
  const { name } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name is required' });
  const item = { id: nextId++, name };
  items.push(item);
  res.status(201).json(item);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}, version=${APP_VERSION}, host=${INSTANCE_HOSTNAME}`);
});
