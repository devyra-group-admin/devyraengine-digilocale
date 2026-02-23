import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });
dotenv.config({ path: join(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ADMIN_INVITE_TOKEN = process.env.ADMIN_INVITE_TOKEN || '';
const APP_BASE_URL = process.env.APP_BASE_URL || process.env.CLIENT_APP_URL || process.env.VITE_APP_URL || 'http://localhost:5173';
const PASSWORD_RESET_REDIRECT = process.env.PASSWORD_RESET_REDIRECT || APP_BASE_URL;
const INVITE_REDIRECT = process.env.INVITE_REDIRECT || APP_BASE_URL;

const supabasePublic = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

function isValidEmail(value) {
  if (!value || typeof value !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Dullstroom Digital API',
    auth: {
      supabaseUrlConfigured: Boolean(SUPABASE_URL),
      anonKeyConfigured: Boolean(SUPABASE_ANON_KEY),
      serviceRoleConfigured: Boolean(SUPABASE_SERVICE_ROLE_KEY),
      inviteTokenConfigured: Boolean(ADMIN_INVITE_TOKEN),
    },
  });
});

// Basic Routes Structure
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Dullstroom Digital API' });
});

// Password reset endpoint (safe response regardless of user existence)
router.post('/auth/forgot-password', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();

  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, message: 'Valid email is required.' });
  }

  if (!supabasePublic) {
    return res.status(500).json({ ok: false, message: 'Server auth configuration is incomplete.' });
  }

  try {
    const { error } = await supabasePublic.auth.resetPasswordForEmail(email, {
      redirectTo: PASSWORD_RESET_REDIRECT,
    });

    if (error) {
      // Avoid account enumeration in API responses while still logging for server diagnostics.
      console.error('Forgot-password request failed:', error.message);
    }

    return res.json({
      ok: true,
      message: 'If that email is registered, a password reset email has been sent.',
    });
  } catch (error) {
    console.error('Forgot-password request crashed:', error);
    return res.status(500).json({ ok: false, message: 'Unable to process password reset right now.' });
  }
});

// Invite-only owner account creation (admin token protected)
router.post('/admin/invite-owner', async (req, res) => {
  const token = String(req.headers['x-admin-invite-token'] || '').trim();

  if (!ADMIN_INVITE_TOKEN) {
    return res.status(500).json({ ok: false, message: 'ADMIN_INVITE_TOKEN is not configured.' });
  }

  if (token !== ADMIN_INVITE_TOKEN) {
    return res.status(401).json({ ok: false, message: 'Unauthorized.' });
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ ok: false, message: 'SUPABASE_SERVICE_ROLE_KEY is not configured.' });
  }

  const email = String(req.body?.email || '').trim().toLowerCase();
  const fullName = String(req.body?.fullName || '').trim();
  const redirectTo = String(req.body?.redirectTo || '').trim() || INVITE_REDIRECT;

  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, message: 'Valid email is required.' });
  }

  try {
    const inviteOptions = {
      redirectTo,
      data: {},
    };

    if (fullName) {
      inviteOptions.data.full_name = fullName;
    }

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, inviteOptions);

    if (error) {
      return res.status(400).json({ ok: false, message: error.message });
    }

    return res.json({
      ok: true,
      message: 'Invite sent.',
      email,
      userId: data?.user?.id || null,
    });
  } catch (error) {
    console.error('Invite-owner request crashed:', error);
    return res.status(500).json({ ok: false, message: 'Unable to send invite right now.' });
  }
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
