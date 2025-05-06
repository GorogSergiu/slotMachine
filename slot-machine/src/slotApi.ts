import { Prize } from './types';

const API_URL = import.meta.env.VITE_API_URL + '/api';

export const fetchPrizes = async (): Promise<Prize[]> => {
  try {
    const response = await fetch(`${API_URL}/prizes`);
    if (!response.ok) {
      throw new Error('Failed to fetch prizes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching prizes:', error);
    throw error;
  }
};

export const updatePrizeStock = async (name: string, stock: number): Promise<Prize> => {
  try {
    const response = await fetch(`${API_URL}/updatePrizeStock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, stock }),
    });

    if (!response.ok) {
      throw new Error('Failed to update prize stock');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating prize stock:', error);
    throw error;
  }
};

// New API: decrement prize stock by 1
export const decrementPrizeStock = async (name: string): Promise<Prize> => {
  // Fetch current stock, then update
  const prizes = await fetchPrizes();
  const prize = prizes.find((p) => p.name === name);
  if (!prize || prize.stock <= 0) throw new Error('Prize not found or out of stock');
  return updatePrizeStock(name, prize.stock - 1);
};
