import { supabase } from '../config/supabase';

export type Activity = {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  target: string;
  date: string;
  score?: string;
};

export async function getRecentActivities(limit = 20): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
  return data || [];
}
