import { supabase } from './supabase';
import { Prize } from './types';

/** Lista premiilor, pentru afisajul ruletei. */
export const fetchPrizes = async (): Promise<Prize[]> => {
  const { data, error } = await supabase.from('prizes').select('name, stock').order('id');

  if (error) {
    console.error('Error fetching prizes:', error);
    throw error;
  }
  return data ?? [];
};

/**
 * Alege un premiu ponderat si ii scade stocul, atomic, in baza de date.
 * `spin()` intoarce un set de 0 sau 1 randuri; gol = nu mai e nimic pe stoc.
 */
export const spin = async (): Promise<Prize | null> => {
  const { data, error } = await supabase.rpc('spin');

  if (error) {
    console.error('Error spinning:', error);
    throw error;
  }

  const winner = (data as Prize[] | null)?.[0];
  return winner ? { name: winner.name, stock: winner.stock } : null;
};
