import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient('https://thufxdqmownucaydlkeg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRodWZ4ZHFtb3dudWNheWRsa2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NzcxMjMsImV4cCI6MjA2MzE1MzEyM30.eq0VuBK8StAy2RbTs1Rg48aZpbdQvlR_0ddSrciWClE')