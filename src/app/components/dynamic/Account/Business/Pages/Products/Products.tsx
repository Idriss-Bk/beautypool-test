"use client";
import React, { useEffect, useState } from "react";
import localFont from "next/font/local";
import Sidenav from "@/app/components/dynamic/Account/Businesses/Sidenav";
import Header from "@/app/components/dynamic/Account/Business/Header/Header";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FiPlus } from "react-icons/fi";
import api from "@/services/auth";
import Image from "next/image";
import Link from "next/link";

const GDSageBold = localFont({
  src: "../../../../../../fonts/GDSage-Bold.ttf",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Define a type for user data
interface UserData {
  id: string;
  first_name: string;
}

interface Article {
  id: string;
  label: string;
  featured_image: string;
  address: string;
  user_created: string;
}

const Products = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleUserDataFetched = (data: UserData | null) => {
    setUserData(data);
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get(
          `/items/articles?filter[user_created][_eq]=${userData?.id}`
        );
        setArticles(response.data.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError("Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [userData?.id]);

  return (
    <div className="">
      <Header onUserDataFetched={handleUserDataFetched} />
      <Sidenav />

      <div className="ml-0 lg:ml-44 p-5 xl:pt-32 xl:pl-14 overflow-auto bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2
                className={`${GDSageBold.className} text-4xl text-black font-bold`}
              >
                Products
              </h2>
              <p className="text-slate-800 text-md font-medium">
                View and manage the products offered by your business.
              </p>
            </div>
            <div>
              <Link href="/business/products/product-add" className="py-2 px-4 rounded bg-slate-900 text-white font-semibold">
                <FiPlus className="inline-block size-5 relative -top-[1px]" />{" "}
                <span className="hidden lg:inline">Add New</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div
                key={article.id}
                className="w-full rounded overflow-hidden shadow-lg bg-white"
              >
                <div className="relative">
                  <Image
                    className="w-full"
                    src={`http://109.199.103.20:2022/assets/${article.featured_image}`}
                    alt={article.label}
                    height={300}
                    width={600}
                  />
                  <div className="absolute top-2 right-2 cursor-pointer bg-white rounded-full p-1 shadow">
                    <HiOutlineDotsVertical className="size-6" />
                  </div>
                </div>
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{article.label}</div>
                  <p className="text-gray-700 text-base">
                    <span className="font-bold">5.0</span>{" "}
                    <i className="fas fa-star text-black"></i> (1,434)
                  </p>
                  <p className="text-gray-700 text-base">
                    Madison Building, Midtown, Queensway,...
                  </p>
                </div>
                <div className="px-6 pt-4 pb-2">
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    Hair Salon
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
