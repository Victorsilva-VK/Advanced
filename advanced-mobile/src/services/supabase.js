import { createClient } from '@supabase/supabase-js';

// Project URL
const supabaseUrl = 'https://kmzmwfvpnstpuwnshylz.supabase.co'; 

// Publishable API Key
const supabaseKey = 'sb_publishable_vEUS_uNMqfEImyV9kupB0g_LHJWyQ35';

// Cria a conexão oficial
export const supabase = createClient(supabaseUrl, supabaseKey);