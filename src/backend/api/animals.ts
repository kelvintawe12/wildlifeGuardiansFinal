import { supabase } from '../config/supabase';
export type Animal = {
  id: string;
  name: string;
  scientific_name: string;
  status: 'critical' | 'endangered' | 'vulnerable' | 'near_threatened' | 'least_concern';
  habitat: string;
  population: string;
  description: string;
  image_url?: string;
  facts: string[];
  threats: string[];
  views: number;
  created_at: string;
  updated_at: string;
};
export type AnimalInput = Omit<Animal, 'id' | 'views' | 'created_at' | 'updated_at'>;
export async function getAllAnimals(): Promise<Animal[]> {
  const {
    data,
    error
  } = await supabase.from('animals').select('*').order('name');
  if (error) {
    console.error('Error fetching animals:', error);
    throw error;
  }
  return data || [];
}
export async function getAnimalById(id: string): Promise<Animal | null> {
  const {
    data,
    error
  } = await supabase.from('animals').select('*').eq('id', id).single();
  if (error) {
    console.error(`Error fetching animal with ID ${id}:`, error);
    throw error;
  }
  return data;
}
export async function createAnimal(animal: AnimalInput): Promise<Animal> {
  try {
    const { data, error } = await supabase.from('animals').insert([animal]).select();
    if (error) {
      console.error('Error creating animal:', error);
      throw error;
    }
    console.log('Animal created successfully:', data);
    return data![0];
  } catch (err) {
    console.error('Exception in createAnimal:', err);
    throw err;
  }
}
export async function updateAnimal(id: string, animal: Partial<AnimalInput>): Promise<Animal> {
  const {
    data,
    error
  } = await supabase.from('animals').update({
    ...animal,
    updated_at: new Date().toISOString()
  }).eq('id', id).select();
  if (error) {
    console.error(`Error updating animal with ID ${id}:`, error);
    throw error;
  }
  return data![0];
}
export async function deleteAnimal(id: string): Promise<void> {
  const {
    error
  } = await supabase.from('animals').delete().eq('id', id);
  if (error) {
    console.error(`Error deleting animal with ID ${id}:`, error);
    throw error;
  }
}
export async function incrementAnimalViews(id: string): Promise<void> {
  const {
    error
  } = await supabase.rpc('increment_animal_views', {
    animal_id: id
  });
  if (error) {
    console.error(`Error incrementing views for animal with ID ${id}:`, error);
    throw error;
  }
}