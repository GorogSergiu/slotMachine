import axios from "axios";

const API_URL = "http://localhost:5001/api/products";

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

// Add a new product
export const addProduct = async (
  name: string,
  description: string,
  price: number,
  category: { _id: string; name: string },
  stock: number,
  secondaryImages: string[],
  primaryImage: string,
  token: string
) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(
      `${API_URL}/add`,
      {
        name,
        description,
        price,
        category,
        stock,
        secondaryImages,
        primaryImage,
      },
      config
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Product creation failed.";
  }
};

// Delete a product by ID
export const deleteProduct = async (
  productId: string,
  token: string
): Promise<string> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.delete(
      `${API_URL}/delete/${productId}`,
      config
    );
    return response.data.message;
  } catch (error: any) {
    throw error.response?.data?.message || "Product deletion failed.";
  }
};

export const adminGetAllProducts = async (): Promise<ProductData[]> => {
  try {
    const response = await axios.get<ProductData[]>(`${API_URL}/get`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    throw error.response?.data || error.message;
  }
};
