// API Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api/v1' : 'http://localhost:5000/api/v1'),
  supabaseURL: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  timeout: 10000,
};

export default API_CONFIG;
