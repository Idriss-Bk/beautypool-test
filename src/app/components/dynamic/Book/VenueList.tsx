import api from "@/services/auth";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { IoStar } from "react-icons/io5";

interface Article {
  id: string;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
  image: string;
  rating: number;
  reviews: number;
  distance: string;
  services: { name: string; price: number }[];
}

interface VenueListProps {
  venues: Article[];
  location: { latitude: number; longitude: number; address: string | null };
}

const VenueList: React.FC<VenueListProps> = ({ venues, location }) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getArticles = async () => {
      const savedCategoryId = localStorage.getItem("selectedCategoryId");
      const accessToken = Cookies.get("access_token"); // Retrieve the access token from cookies
      if (savedCategoryId && accessToken) {
        try {
          const response = await api.get("/items/articles", {
            params: {
              filter: {
                category: {
                  _eq: savedCategoryId,
                },
                Address: {
                  _contains: location.address, // Filter by address containing the location
                },
              },
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setArticles(response.data.data); // Storing data as an array
          console.log(response.data.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching articles:", error);
          setLoading(false);
        }
      } else {
        console.error("Missing required parameters: savedCategoryId or accessToken");
        setLoading(false);
      }
    };
    getArticles();
  }, [location]);

  return (
    <div className="venue-list">
      {loading ? (
        <div className="flex justify-center items-center mx-auto">
          <div className="flex justify-center items-center">
            <>loading...</>
          </div>
        </div>
      ) : articles?.length === 0 ? (
        <>No Treatment Found!</>
      ) : (
        articles.map((article) => (
          <Link
            key={article.id}
            href={`/a/${article.slug}`}
            className="venue-item"
          >
            <div className="bg-white rounded-lg overflow-hidden">
              <img
                src={`http://109.199.103.20:2022/assets/${article.featured_image}`}
                alt={article.label}
                className="w-full"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{article.label}</h2>
                <div className="flex items-center mt-2">
                  <span className="text-lg font-bold">5.0</span>
                  <div className="flex ml-2 text-yellow-500">
                    <IoStar />
                    <IoStar />
                    <IoStar />
                    <IoStar />
                    <IoStar />
                  </div>
                  <span className="text-gray-600 ml-2">(8)</span>
                </div>
                <p className="text-gray-600 mt-2 text-sm">{article.Address}</p>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default VenueList;
