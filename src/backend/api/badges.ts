import { supabase } from '../config/supabase';
export type Badge = {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url?: string;
  requirements: Record<string, any>;
  created_at: string;
  updated_at: string;
};
export type BadgeInput = Omit<Badge, 'id' | 'created_at' | 'updated_at'>;
export async function getAllBadges(): Promise<Badge[]> {
  const {
    data,
    error
  } = await supabase.from('badges').select('*').order('name');
  if (error) {
    console.error('Error fetching badges:', error);
    throw error;
  }
  return data || [];
}
export async function getBadgeById(id: string): Promise<Badge | null> {
  const {
    data,
    error
  } = await supabase.from('badges').select('*').eq('id', id).single();
  if (error) {
    console.error(`Error fetching badge with ID ${id}:`, error);
    throw error;
  }
  return data;
}
export async function createBadge(badge: BadgeInput): Promise<Badge> {
  const {
    data,
    error
  } = await supabase.from('badges').insert([badge]).select();
  if (error) {
    console.error('Error creating badge:', error);
    throw error;
  }
  return data![0];
}
export async function updateBadge(id: string, badge: Partial<BadgeInput>): Promise<Badge> {
  const {
    data,
    error
  } = await supabase.from('badges').update({
    ...badge,
    updated_at: new Date().toISOString()
  }).eq('id', id).select();
  if (error) {
    console.error(`Error updating badge with ID ${id}:`, error);
    throw error;
  }
  return data![0];
}
export async function deleteBadge(id: string): Promise<void> {
  const {
    error
  } = await supabase.from('badges').delete().eq('id', id);
  if (error) {
    console.error(`Error deleting badge with ID ${id}:`, error);
    throw error;
  }
}
export async function getBadgeAwardCount(): Promise<Record<string, number>> {
  const {
    data,
    error
  } = await supabase.from('user_badges').select('badge_id, count').select('badge_id, count(*)').group('badge_id');
  if (error) {
    console.error('Error fetching badge award counts:', error);
    throw error;
  }
  const result: Record<string, number> = {};
  data?.forEach(item => {
    result[item.badge_id] = parseInt(item.count);
  });
  return result;
}