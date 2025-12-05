import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const CONFIG_FILE = join(__dirname, 'config.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

if (!existsSync(CONFIG_FILE)) {
  writeFileSync(CONFIG_FILE, JSON.stringify({
    ha_url: "",
    ha_token: "",
    weather_entity: "weather.forecast_home",
    location_name: "北京市",
    demo_mode: false,
    demo_state: "CLEAR_DAY"
  }, null, 2), 'utf8');
}

let syncTrigger = Date.now();

app.get('/api/config', (req, res) => {
  try {
    const config = JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read config' });
  }
});

app.post('/api/config', (req, res) => {
  try {
    writeFileSync(CONFIG_FILE, JSON.stringify(req.body, null, 2), 'utf8');
    syncTrigger = Date.now();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save config' });
  }
});

app.get('/api/sync-trigger', (req, res) => {
  res.json({ timestamp: syncTrigger });
});

app.get('/favicon.ico', (req, res) => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
<circle cx="16" cy="16" r="6" fill="#FDB813"/>
<path d="M16 4v4M16 24v4M28 16h-4M8 16H4M24.5 7.5l-2.8 2.8M10.3 21.7l-2.8 2.8M24.5 24.5l-2.8-2.8M10.3 10.3l-2.8-2.8" stroke="#FDB813" stroke-width="2" stroke-linecap="round"/>
</svg>`;
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'config.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Config server running on http://0.0.0.0:${PORT}`);
  console.log(`🌐 Web UI: http://localhost:${PORT}`);
  console.log(`📱 App API: http://<your-ip>:${PORT}/api/config`);
});
