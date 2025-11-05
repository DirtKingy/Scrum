import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'      // lokaal
const supabaseAnonKey = 'sbp_529565f72318c285e75ac6f7d1741da07d2ec3ea'       // dummy voor lokaal

export const supabase = createClient(supabaseUrl, supabaseAnonKey)