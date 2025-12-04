import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { WebSocketServer } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const WS_PORT = 3002;
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

// WebSocket server for real-time config updates
const wss = new WebSocketServer({ port: WS_PORT });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('📱 Client connected to WebSocket');

  ws.on('close', () => {
    clients.delete(ws);
    console.log('📱 Client disconnected from WebSocket');
  });
});

function broadcastConfigUpdate(config) {
  const message = JSON.stringify({ type: 'config_update', data: config });
  clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

app.get('/api/config', (req, res) => {
  try {
    const config = JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read config' });
  }
});

app.post('/api/config', (req, res) => {
  try {
    writeFileSync(CONFIG_FILE, JSON.stringify(req.body, null, 2), 'utf8');
    broadcastConfigUpdate(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save config' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'config.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Config server running on http://0.0.0.0:${PORT}`);
  console.log(`🔗 WebSocket server running on ws://0.0.0.0:${WS_PORT}`);
  console.log(`🌐 Web UI: http://localhost:${PORT}`);
  console.log(`📱 App API: http://<your-ip>:${PORT}/api/config`);
});
