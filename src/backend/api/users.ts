import { supabase } from '../config/supabase';
export type User = {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'inactive';
  join_date: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};
export type UserInput = Omit<User, 'id' | 'created_at' | 'updated_at' | 'join_date'> & { password: string };
export async function getAllUsers(): Promise<User[]> {
  const {
    data,
    error
  } = await supabase.from('users').select('*').order('name');
  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
  return data || [];
}
export async function getUserById(id: string): Promise<User | null> {
  const {
    data,
    error
  } = await supabase.from('users').select('*').eq('id', id).single();
  if (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
  return data;
}
export async function createUser(user: UserInput): Promise<User> {
  try {
    const now = new Date().toISOString();
    console.log('[createUser] Creating user with:', { ...user, join_date: now, created_at: now, updated_at: now });
    const { data, error } = await supabase.from('users').insert([
      {
        ...user,
        join_date: now,
        created_at: now,
        updated_at: now
      }
    ]).select();
    if (error) {
      console.error('[createUser] Error creating user:', error);
      throw error;
    }
    console.log('[createUser] User created:', data?.[0]);
    return data![0];
  } catch (err) {
    console.error('[createUser] Exception:', err);
    throw err;
  }
}

// Login function: check user by email and password (plaintext for demo; use hashing in production)
export async function loginUser(email: string, password: string): Promise<User | null> {
  try {
    console.log('[loginUser] Attempting login for:', email);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .maybeSingle();
    if (error) {
      console.error('[loginUser] Error logging in:', error);
      throw error;
    }
    if (data) {
      console.log('[loginUser] Login successful for:', email);
    } else {
      console.log('[loginUser] Login failed for:', email);
    }
    return data || null;
  } catch (err) {
    console.error('[loginUser] Exception:', err);
    throw err;
  }
}
export async function updateUser(id: string, user: Partial<UserInput>): Promise<User> {
  try {
    // For development purposes, we'll use localStorage instead of Supabase
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    const updatedUser = {
      ...users[userIndex],
      ...user,
      updated_at: new Date().toISOString()
    };
    users[userIndex] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));
    return updatedUser;
  } catch (err) {
    console.error(`Error updating user with ID ${id}:`, err);
    throw err;
  }
}
export async function deleteUser(id: string): Promise<void> {
  try {
    // For development purposes, we'll use localStorage instead of Supabase
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filteredUsers = users.filter((user: User) => user.id !== id);
    localStorage.setItem('users', JSON.stringify(filteredUsers));
  } catch (err) {
    console.error(`Error deleting user with ID ${id}:`, err);
    throw err;
  }
}
export async function getUserStats(): Promise<{
  total: number;
  active: number;
  byRole: Record<string, number>;
}> {
  try {
    // For development purposes, we'll use localStorage instead of Supabase
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const totalUsers = users.length;
    const activeUsers = users.filter((user: User) => user.status === 'active').length;
    // Get users by role
    const byRole: Record<string, number> = {};
    users.forEach((user: User) => {
      byRole[user.role] = (byRole[user.role] || 0) + 1;
    });
    return {
      total: totalUsers,
      active: activeUsers,
      byRole
    };
  } catch (err) {
    console.error('Error getting user stats:', err);
    throw err;
  }
}
export async function getUserActivity(userId: string): Promise<any[]> {
  try {
    // Mock data for development
    return [{
      id: '1',
      activity_type: 'quiz_completion',
      activity_details: {
        quiz_id: '1',
        quiz_title: 'Mountain Gorilla Quiz',
        score: 5,
        max_score: 5
      },
      created_at: new Date().toISOString()
    }, {
      id: '2',
      activity_type: 'badge_earned',
      activity_details: {
        badge_id: '1',
        badge_name: 'Gorilla Expert'
      },
      created_at: new Date(Date.now() - 86400000).toISOString()
    }];
  } catch (err) {
    console.error(`Error fetching activity for user with ID ${userId}:`, err);
    throw err;
  }
}
export async function getUserBadges(userId: string): Promise<any[]> {
  try {
    // Mock data for development
    return [{
      id: '1',
      awarded_at: new Date().toISOString(),
      badges: {
        id: '1',
        name: 'Gorilla Expert',
        description: 'Completed the Mountain Gorilla Quiz with a perfect score',
        image_url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
      }
    }];
  } catch (err) {
    console.error(`Error fetching badges for user with ID ${userId}:`, err);
    throw err;
  }
}
export async function getUserQuizResults(userId: string): Promise<any[]> {
  try {
    // Mock data for development
    return [{
      id: '1',
      score: 5,
      max_score: 5,
      completed_at: new Date().toISOString(),
      quizzes: {
        id: '1',
        title: 'Mountain Gorilla Quiz'
      }
    }];
  } catch (err) {
    console.error(`Error fetching quiz results for user with ID ${userId}:`, err);
    throw err;
  }
}