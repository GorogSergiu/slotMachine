import axios from "axios";

const API_URL = "http://localhost:5001/api/products"; // Replace with your actual API

export interface ProductData {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  secondaryImages: string[];
  primaryImage: string;
}

export const getAllProducts = async (): Promise<ProductData[]> => {
  try {
    const response = await axios.get<ProductData[]>(`${API_URL}/get`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    throw error.response?.data || error.message;
  }
};
