import { createClient } from '@supabase/supabase-js';

import { supabase } from './supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Este cliente ignora o RLS e deve ser usado apenas em rotas de API protegidas
// Caso a chave de serviço não esteja configurada localmente, retorna o cliente anônimo como Fallback.
export const supabaseAdmin = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase;

