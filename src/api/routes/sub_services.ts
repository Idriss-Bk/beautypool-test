import axios from "axios";

const DIRECTUS_API_BASE_URL = "http://109.199.103.20:2022"; // Replace with your actual base URL

export interface SubService {
  name: string;
}

export interface Service {
  Services_id: {
    sub_services: SubService[];
  };
}

export interface Category {
  Categorie_id: {
    services: Service[];
  };
}

export interface UserCategoryData {
  category: Category[];
}

export const fetchCategoriesByUserId = async (userId: string): Promise<UserCategoryData | null> => {
  try {
    const response = await axios.get(`${DIRECTUS_API_BASE_URL}/users/${userId}`, {
      params: {
        "fields[]": "category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.name",
      },
    });

    console.log("API Response:", response.data); // Debugging line
    return response.data.data as UserCategoryData;
  } catch (error) {
    console.error("Error fetching categories:", error); // Debugging error details
    return null;
  }
};

