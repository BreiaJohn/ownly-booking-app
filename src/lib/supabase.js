import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://tygcjsiijollyssdwjvr.supabase.co"
const supabaseAnonKey = "sb_publishable_pkh0YN2akN6jqkj4IftNCA_OzIhMwTJ"

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)