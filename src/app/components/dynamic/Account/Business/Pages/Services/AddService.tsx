// "use client";
// import React, { FormEvent, useEffect, useState } from "react";
// import localFont from "next/font/local";
// import Sidenav from "@/app/components/dynamic/Account/Businesses/Sidenav";
// import Header from "@/app/components/dynamic/Account/Business/Header/Header";
// import api from "@/services/auth";

// interface Category {
//   id: number;
//   label: string;
// }

// interface ServiceData {
//   name: string;
//   duration: number;
//   price: number;
//   description: string;
//   status: "published" | "draft";
//   categories: number;
//   price_type: "fixed" | "variable";
// }

// const GDSageBold = localFont({
//   src: "../../../../../../fonts/GDSage-Bold.ttf",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// const AddService = () => {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [formData, setFormData] = useState<ServiceData>({
//     name: "",
//     duration: 0,
//     price: 0,
//     description: "",
//     status: "published",
//     categories: 0,
//     price_type: "fixed",
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await api.get("users/me", {
//           params: {
//             fields: "category.Categorie_id.id,category.Categorie_id.label",
//           },
//         });

//         const categoryData = response.data.data.category.map((cat: any) => ({
//           id: cat.Categorie_id.id,
//           label: cat.Categorie_id.label,
//         }));

//         setCategories(categoryData);

//         if (categoryData.length > 0) {
//           setFormData((prev) => ({
//             ...prev,
//             categories: categoryData[0].id,
//           }));
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await api.post("items/Services", formData, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.status === 200 || response.status === 201) {
//         alert("Service created successfully!");
//         setFormData({
//           name: "",
//           duration: 30,
//           price: 20,
//           description: "",
//           status: "published",
//           categories: categories[0]?.id || 0,
//           price_type: "fixed",
//         });
//       }
//     } catch (error) {
//       console.error("Error creating service:", error);
//       alert("Failed to create service");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: ["duration", "categories", "price"].includes(name)
//         ? Number(value)
//         : value,
//     }));
//   };

//   return (
//     <div className="">
//       <Header />
//       <Sidenav />

//       <div className="ml-0 lg:ml-44 p-5 xl:pt-32 xl:pl-14 overflow-auto bg-slate-50 min-h-screen">
//         <div className="max-w-3xl mx-auto">
//           <form action="" onSubmit={handleSubmit}>
//             <div className="flex justify-between items-center mb-5">
//               <h2
//                 className={`${GDSageBold.className} text-4xl text-black font-bold`}
//               >
//                 New service
//               </h2>
//               <button
//                 className="py-2 px-4 rounded bg-slate-900 text-white font-semibold"
//                 type="submit"
//                 disabled={loading}
//               >
//                 {loading ? "Saving..." : "Save"}
//               </button>
//             </div>
//             <div className="lg:flex gap-5">
//               <div className="lg:w-12/12">
//                 <div className="bg-white p-4 rounded-lg border border-slate-200">
//                   <h4 className="text-lg font-semibold pb-4 -ml-4 px-4 -mr-4 border-b border-slate-200 mb-4">
//                     Basic details
//                   </h4>
//                   <div className="grid grid-cols-1">
//                     <div className="mb-5">
//                       <label
//                         className="block text-gray-900 text-[13px] font-semibold mb-1"
//                         htmlFor="Servicename"
//                       >
//                         Service name
//                       </label>
//                       <input
//                         className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         type="text"
//                         id="Servicename"
//                         name="name"
//                         value={formData.name}
//                         autoComplete="off"
//                         onChange={handleChange}
//                         required
//                         placeholder="Enter service name"
//                       />
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="mb-5">
//                       <label
//                         className="block text-gray-900 text-[13px] font-semibold mb-1"
//                         htmlFor="description"
//                       >
//                         Menu category
//                       </label>
//                       <select
//                         id="categories"
//                         name="categories"
//                         value={formData.categories}
//                         onChange={handleChange}
//                         className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         required
//                       >
//                         {categories.map((category) => (
//                           <option key={category.id} value={category.id}>
//                             {category.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1">
//                     <div className="">
//                       <label
//                         className="block text-gray-900 text-[13px] font-semibold mb-1"
//                         htmlFor="description"
//                       >
//                         Description (Optional)
//                       </label>
//                       <textarea
//                         className="shadow min-h-28 max-h-28 appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         autoComplete="off"
//                         id="description"
//                         name="description"
//                         value={formData.description}
//                         onChange={handleChange}
//                         rows={3}
//                         placeholder="Enter service description"
//                       ></textarea>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-white p-4 rounded-lg border border-slate-200 mt-5 mb-10">
//                   <h4 className="text-lg font-semibold pb-4 -ml-4 px-4 -mr-4 border-b border-slate-200 mb-4">
//                     Pricing and duration
//                   </h4>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                     <div className="">
//                       <label
//                         className="block text-gray-900 text-[13px] font-semibold mb-1"
//                         htmlFor="Duration"
//                       >
//                         Duration
//                       </label>
//                       <select
//                         className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         id="duration"
//                         name="duration"
//                         value={formData.duration}
//                         onChange={handleChange}
//                         required
//                       >
//                         <option value="">Select duration</option>
//                         <option value="5">5min</option>
//                         <option value="10">10min</option>
//                         <option value="15">15min</option>
//                         <option value="20">20min</option>
//                         <option value="25">25min</option>
//                         <option value="30">30min</option>
//                         <option value="35">35min</option>
//                         <option value="40">40min</option>
//                         <option value="45">45min</option>
//                         <option value="50">50min</option>
//                         <option value="55">55min</option>
//                         <option value="60">1h</option>
//                         <option value="65">1h 5min</option>
//                         <option value="70">1h 10min</option>
//                         <option value="75">1h 15min</option>
//                         <option value="80">1h 20min</option>
//                         <option value="85">1h 25min</option>
//                         <option value="90">1h 30min</option>
//                         <option value="95">1h 35min</option>
//                         <option value="100">1h 40min</option>
//                         <option value="105">1h 45min</option>
//                         <option value="110">1h 50min</option>
//                         <option value="115">1h 55min</option>
//                         <option value="120">2h</option>
//                         <option value="135">2h 15min</option>
//                         <option value="150">2h 30min</option>
//                         <option value="165">2h 45min</option>
//                         <option value="180">3h</option>
//                         <option value="195">3h 15min</option>
//                         <option value="210">3h 30min</option>
//                         <option value="225">3h 45min</option>
//                         <option value="240">4h</option>
//                         <option value="270">4h 30min</option>
//                         <option value="300">5h</option>
//                         <option value="330">5h 30min</option>
//                         <option value="360">6h</option>
//                         <option value="390">6h 30min</option>
//                         <option value="420">7h</option>
//                         <option value="450">7h 30min</option>
//                         <option value="480">8h</option>
//                         <option value="540">9h</option>
//                         <option value="600">10h</option>
//                         <option value="660">11h</option>
//                         <option value="720">12h</option>
//                       </select>
//                     </div>
//                     <div className="">
//                       <label
//                         className="block text-gray-900 text-[13px] font-semibold mb-1"
//                         htmlFor="PriceType"
//                       >
//                         Price type
//                       </label>
//                       <select
//                         id="price_type"
//                         name="price_type"
//                         value={formData.price_type}
//                         onChange={handleChange}
//                         className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                       >
//                         <option value="fixed">Fixed</option>
//                         <option value="variable">Variable</option>
//                       </select>
//                     </div>
//                     <div className="">
//                       <label
//                         className="block text-gray-900 text-[13px] font-semibold mb-1"
//                         htmlFor="Price"
//                       >
//                         Price
//                       </label>
//                       <input
//                         className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         type="number"
//                         id="price"
//                         name="price"
//                         value={formData.price}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddService;

"use client";
import React, { useState, useEffect } from "react";
import AddSubServiceForm from "./AddSubServiceForm"; // Import the AddSubServiceForm component
import api from "@/services/auth";
import Cookies from "js-cookie";
import axios from "axios";

interface SubService {
  id: string;
  name: string;
  price: number;
  duration: number;
  price_type: string;
}

interface Props {
  parentServiceId: string; // Add this
  onSubServiceAdded: (newSubService: SubService) => void;
  onClose: () => void;
}

interface ParentService {
  id: string;
  name: string;
  description: string;
  sub_services: SubService[];
}

interface ServiceDropdownProps {
  onSubServiceAdded: (parentServiceId: string, newSubService: SubService) => void;
}

const ServiceDropdown: React.FC<ServiceDropdownProps> = ({ onSubServiceAdded }) => {
  const [selectedService, setSelectedService] = useState<ParentService | null>(null);
  const [addingSubService, setAddingSubService] = useState(false);

  const [services, setServices] = useState<ParentService[]>([]);

  // Fetch and Flatten Services
  useEffect(() => {
    axios
      .get(
        "http://109.199.103.20:2022/users/me?fields[]=category.Categorie_id.services.Categorie_id.services.Services_id.name&fields[]=category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.name&fields[]=category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.price&fields[]=category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.duration&fields[]=category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.price_type&fields[]=category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.description"
      )
      .then((response) => {
        const allServices = response.data.data.category.flatMap(
          (cat: any) =>
            cat.Categorie_id?.services?.map((service: any) => ({
              name: service.Categorie_id?.services?.[0]?.Services_id?.name,
              id: service.Categorie_id?.services?.[0]?.Services_id?.id || "",
              sub_services:
                service.Categorie_id?.services?.[0]?.Services_id?.sub_services || [],
            })) || []
        );
  
        setServices(allServices);
      });
  }, []);
  

  const handleServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceId = event.target.value;
    const selected = services.find((service) => service.id === serviceId) || null;
    setSelectedService(selected);
    setAddingSubService(false); // Reset the adding sub-service state
  };

  const handleAddSubService = (newSubService: SubService) => {
    if (selectedService) {
      onSubServiceAdded(selectedService.id, newSubService);
      setAddingSubService(false); // Reset the adding sub-service state
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Services</h2>
      {services.length > 0 ? (
        <select
          onChange={handleServiceChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select a Service</option>
          {services.map((service, index) => (
        <option key={index} value={service.id}>
          {service.name}
        </option>
      ))}
        </select>
      ) : (
        <p>No services available.</p>
      )}
      {selectedService && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">{selectedService.name}</h3>
          {selectedService.sub_services.length > 0 ? (
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {selectedService.sub_services.map((subService) => (
                <option key={subService.id} value={subService.name}>
                  {subService.name}
                </option>
              ))}
            </select>
          ) : (
            <div>
              <p>No sub-services available.</p>
              <button
                onClick={() => setAddingSubService(true)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add New Sub-Service
              </button>
            </div>
          )}
          {addingSubService && (
            <AddSubServiceForm
              parentServiceId={selectedService.id}
              onSubServiceAdded={handleAddSubService}
              onClose={() => setAddingSubService(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceDropdown;
