import axios from "axios";

const API_URL = "http://localhost:5001/api/categories";

export interface CategoryData {
  _id?: string;
  name: string;
  isSecondary: boolean;
  parentId: string;
}

export const adminGetAllCategories = async (): Promise<CategoryData[]> => {
  try {
    const response = await axios.get<CategoryData[]>(`${API_URL}/get`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    throw error.response?.data || error.message;
  }
};

export const adminAddCategory = async (
  name: string,
  token: string,
  isSecondary: boolean,
  parentId: string
) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(
      `${API_URL}/insert`,
      {
        name,
        isSecondary,
        parentId,
      },
      config
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Product creation failed.";
  }
};

export const adminDeleteCategory = async (
  categoryId: string,
  token: string
): Promise<string> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.delete(
      `${API_URL}/delete/${categoryId}`,
      config
    );
    return response.data.message;
  } catch (error: any) {
    throw error.response?.data?.message || "Product deletion failed.";
  }
};
