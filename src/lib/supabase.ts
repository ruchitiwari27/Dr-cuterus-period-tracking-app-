import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://eppczyishsdryblegxju.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwcGN6eWlzaHNkcnlibGVneGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNjQwODcsImV4cCI6MjA5MTY0MDA4N30.3X2s0TE3Psx1LCIfLEGIQR3zACw9MWcSdxdFtJoUybM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
