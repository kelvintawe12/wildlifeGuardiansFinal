import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://nroxhpehcivziorueujg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yb3hocGVoY2l2emlvcnVldWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODE3MjksImV4cCI6MjA2OTU1NzcyOX0.IH5fBkFPs5DGV7jZDfYwuXrskucjR57qAC46j-v4Yao';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);