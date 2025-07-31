import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nroxhpehcivziorueujg.supabase.co';

const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yb3hocGVoY2l2emlvcnVldWpnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk4MTcyOSwiZXhwIjoyMDY5NTU3NzI5fQ.hsPc4Wq48A29VJygkH2A_PYfIKbh9H9q4Fxi1UsfiqE';

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
