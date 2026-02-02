import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Dullstroom Digital API' 
  });
});

// Basic Routes Structure
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Dullstroom Digital API' });
});

// Serve static files from the client dist directory
const clientDistPath = join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// API Routes
app.use('/api/v1', router);

// Handle SPA routing - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(clientDistPath, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
