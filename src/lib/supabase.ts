import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Getters seguros com fallback para localStorage
export const getSupabase = () => {
    if (typeof window === 'undefined') return null as any;
    
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || localStorage.getItem('scale_custom_supabase_url') || "";
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || localStorage.getItem('scale_custom_supabase_key') || "";
    
    if (!url || !key) return null as any;
    return createBrowserClient(url, key);
};

export const getSupabaseAdmin = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || (typeof window !== 'undefined' ? localStorage.getItem('scale_custom_supabase_url') : "") || "";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || (typeof window !== 'undefined' ? localStorage.getItem('scale_custom_supabase_service_key') : "") || "";
    
    if (typeof window !== 'undefined' || !url || !serviceKey) return null as any;
    return createClient(url, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
};


// Aliases para manter compatibilidade com código existente sem mudar todos os imports agora
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = typeof window !== 'undefined' 
  ? getSupabase() 
  : (url && key ? createClient(url, key) : null as any);

export const supabaseAdmin = typeof window === 'undefined' 
  ? getSupabaseAdmin() 
  : null as any;

