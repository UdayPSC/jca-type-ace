
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vriysspaimcbbxxwqxyz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyaXlzc3BhaW1jYmJ4eHdxeHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4Mjg4MTIsImV4cCI6MjA2MDQwNDgxMn0.Um0XxmxFFtv9jD3NGO3s_MJvnfngYkt34BHHChMP4Do";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
