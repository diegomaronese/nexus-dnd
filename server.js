import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve dados static files under /dados and /Nexus/dados
app.use('/dados', express.static(path.join(__dirname, 'Nexus', 'dados')));
app.use('/Nexus/dados', express.static(path.join(__dirname, 'Nexus', 'dados')));

// Serve site static files
app.use(express.static(path.join(__dirname, 'Nexus', 'site')));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Nexus', 'site', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
