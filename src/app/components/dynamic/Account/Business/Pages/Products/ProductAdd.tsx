// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import localFont from "next/font/local";
// import Sidenav from "@/app/components/dynamic/Account/Businesses/Sidenav";
// import Header from "@/app/components/dynamic/Account/Business/Header/Header";
// import { BsCamera } from "react-icons/bs";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import api from "@/services/auth";
// import Map, { Marker } from "react-map-gl";
// import "mapbox-gl/dist/mapbox-gl.css";

// interface UserData {
//   id: string;
//   first_name: string;
// }

// interface BusinessHour {
//   name: string;
//   open: boolean;
//   start: string;
//   end: string;
// }

// interface Category {
//   id: number;
//   label: string;
// }

// interface Service {
//   id: number;
//   name: string;
// }

// const GDSageBold = localFont({
//   src: "../../../../../../fonts/GDSage-Bold.ttf",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// const days = [
//   { name: "Monday", open: true, start: "--:--", end: "--:--" },
//   { name: "Tuesday", open: true, start: "--:--", end: "--:--" },
//   { name: "Wednesday", open: true, start: "--:--", end: "--:--" },
//   { name: "Thursday", open: true, start: "--:--", end: "--:--" },
//   { name: "Friday", open: true, start: "--:--", end: "--:--" },
//   { name: "Saturday", open: false, start: "--:--", end: "--:--" },
//   { name: "Sunday", open: false, start: "--:--", end: "--:--" },
// ];

// const MAPBOX_TOKEN =
//   "pk.eyJ1IjoiYW5pZmZvdXJkZXYiLCJhIjoiY2xvc28zMXJjMDM4dTJycXc0aHBkN2pmcyJ9.IEOWZZQT6rlwKckMaoTh8g";

// const ProductAdd = () => {
// const [userData, setUserData] = useState<UserData | null>(null);
//   const [businessHours, setBusinessHours] = useState<BusinessHour[]>(days);
//   const [formData, setFormData] = useState({
//     status: "published",
//     label: "",
//     slug: "",
//     description: "",
//     featured_image: "",
//     category: "",
//     reviews: 0,
//     Address: "",
//     article_id: null,
//     galleries: [] as string[],
//     service: "",
//     monday_open: "",
//     monday_close: "",
//     tuesday_open: "",
//     tuesday_close: "",
//     wednesday_open: "",
//     wednesday_close: "",
//     thursday_open: "",
//     thursday_close: "",
//     friday_open: "",
//     friday_close: "",
//     saturday_open: "",
//     saturday_close: "",
//     sunday_open: "",
//     sunday_close: "",
//     latitude: 0,
//     longitude: 0,
//     featured_image_file: null as File | null,
//     gallery_images: [] as File[],
//   });
//   const [profileImage, setProfileImage] = useState<string | ArrayBuffer | null>(
//     null
//   );
//   const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [services, setServices] = useState<Service[]>([]);
//   const [viewport, setViewport] = useState({
//     latitude: 0,
//     longitude: 0,
//     zoom: 10,
//   });
//   const [address, setAddress] = useState<string>("");
//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedLocation, setSelectedLocation] = useState<
//     [number, number] | null
//   >(null);
//   const mapRef = useRef<any>(null);

//   const toggleDay = (index: number) => {
//     const newBusinessHours = [...businessHours];
//     newBusinessHours[index].open = !newBusinessHours[index].open;
//     setBusinessHours(newBusinessHours);

//     setFormData((prevData) => ({
//       ...prevData,
//       [`${String(index).toLowerCase()}_open`]: newBusinessHours[index].open
//         ? businessHours[index].start
//         : "",
//       [`${String(index).toLowerCase()}_close`]: newBusinessHours[index].open
//         ? businessHours[index].end
//         : "",
//     }));
//   };

//   const updateHours = (
//     index: number,
//     type: keyof BusinessHour,
//     value: string | boolean
//   ) => {
//     const newBusinessHours = [...businessHours];
//     // @ts-ignore
//     newBusinessHours[index][type] = value;
//     setBusinessHours(newBusinessHours);

//     setFormData((prevData) => ({
//       ...prevData,
//       [`${String(index).toLowerCase()}_${type}`]: value,
//     }));
//   };

// const handleUserDataFetched = (data: UserData | null) => {
//   setUserData(data);
// };

//   const handleInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//       slug:
//         name === "label"
//           ? value.toLowerCase().replace(/ /g, "-")
//           : formData.slug,
//     });
//   };

//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 2 * 1024 * 1024) {
//         toast.error("Image size must be less than 2MB");
//         return;
//       }

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileImage(reader.result);
//       };
//       reader.readAsDataURL(file);

//       setFormData((prevData) => ({
//         ...prevData,
//         featured_image_file: file,
//       }));
//     }
//   };

//   const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) {
//       const previews: string[] = [];
//       const galleryImages: File[] = [];
//       Array.from(files).forEach((file) => {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           previews.push(reader.result as string);
//           setGalleryPreviews(previews);
//         };
//         reader.readAsDataURL(file);
//         galleryImages.push(file);
//       });

//       setFormData((prevData) => ({
//         ...prevData,
//         gallery_images: galleryImages,
//       }));
//     }
//   };

//   const handleAddressChange = async (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const value = e.target.value;
//     setAddress(value);
//     setFormData({
//       ...formData,
//       Address: value,
//     });

//     if (value.length > 2) {
//       try {
//         const response = await axios.get(
//           `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//             value
//           )}.json`,
//           {
//             params: {
//               access_token: MAPBOX_TOKEN,
//               limit: 5,
//             },
//           }
//         );
//         setSuggestions(
//           response.data.features.map((feature: any) => feature.place_name)
//         );
//       } catch (error) {
//         console.error("Error fetching address suggestions:", error);
//       }
//     } else {
//       setSuggestions([]);
//     }
//   };

//   const handleSuggestionClick = (suggestion: string) => {
//     setAddress(suggestion);
//     setSuggestions([]);
//     axios
//       .get(
//         `https://api.mapbox.com/geocoding/v5/mapbox.places/${suggestion}.json`,
//         {
//           params: {
//             access_token: MAPBOX_TOKEN,
//             limit: 1,
//           },
//         }
//       )
//       .then((response) => {
//         const [longitude, latitude] = response.data.features[0].center;
//         setSelectedLocation([longitude, latitude]);
//         setFormData((prevData) => ({
//           ...prevData,
//           latitude,
//           longitude,
//         }));
//         if (mapRef.current) {
//           mapRef.current.flyTo({
//             center: [longitude, latitude],
//             essential: true,
//           });
//         }
//       });
//   };

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
// const response = await api.get("/users/me", {
//   params: {
//     fields: "category.Categorie_id.id,category.Categorie_id.label",
//   },
// });

//         const categoryData = response.data.data.category.map((cat: any) => ({
//           id: cat.Categorie_id.id,
//           label: cat.Categorie_id.label,
//         }));

//         setCategories(categoryData);

//         if (categoryData.length > 0) {
//           setFormData((prev) => ({
//             ...prev,
//             category: categoryData[0].id,
//           }));
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     const fetchServices = async () => {
//       if (formData.category) {
//         try {
//           const response = await api.get(
//             `/items/Categorie/${formData.category}`,
//             {
//               params: {
//                 fields: "services.Services_id.name",
//               },
//             }
//           );

//           const serviceData = response.data.data.services.map(
//             (service: any) => ({
//               id: service.Services_id.id,
//               name: service.Services_id.name,
//             })
//           );

//           setServices(serviceData);
//         } catch (error) {
//           console.error("Error fetching services:", error);
//         }
//       }
//     };

//     fetchServices();
//   }, [formData.category]);

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     console.log("Form Data:", formData);

//     try {
//       let featuredImageId = "";
//       if (formData.featured_image_file) {
//         const featuredImageFormData = new FormData();
//         featuredImageFormData.append("file", formData.featured_image_file);
//         featuredImageFormData.append(
//           "folder",
//           "baff55fb-1f79-4e88-a6c7-fa7502c69cbb"
//         );

//         const featuredImageResponse = await axios.post(
//           "http://109.199.103.20:2022/files",
//           featuredImageFormData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );

//         featuredImageId = featuredImageResponse.data.data.id;
//       }

//       const galleryIds: string[] = [];
//       const uploadPromises = formData.gallery_images.map((file) => {
//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("folder", "baff55fb-1f79-4e88-a6c7-fa7502c69cbb");

//         return axios
//           .post("http://109.199.103.20:2022/files", formData, {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           })
//           .then((response) => {
//             galleryIds.push(response.data.data.id);
//           });
//       });

//       await Promise.all(uploadPromises);

//       const response = await api.post("/items/articles", {
//         status: formData.status,
//         label: formData.label,
//         slug: formData.slug,
//         description: formData.description,
//         featured_image: featuredImageId,
//         galleries: {
//           create: galleryIds.map((id) => ({
//             articles_id: "+",
//             directus_files_id: { id: id },
//           })),
//         },
//         category: formData.category,
//         service: {
//           create: [
//             {
//               articles_id: "+",
//               Services_id: { id: formData.service },
//             },
//           ],
//         },
//         Address: formData.Address,
//         monday_open: formData.monday_open,
//         monday_close: formData.monday_close,
//         tuesday_open: formData.tuesday_open,
//         tuesday_close: formData.tuesday_close,
//         wednesday_open: formData.wednesday_open,
//         wednesday_close: formData.wednesday_close,
//         thursday_open: formData.thursday_open,
//         thursday_close: formData.thursday_close,
//         friday_open: formData.friday_open,
//         friday_close: formData.friday_close,
//         saturday_open: formData.saturday_open,
//         saturday_close: formData.saturday_close,
//         sunday_open: formData.sunday_open,
//         sunday_close: formData.sunday_close,
//         latitude: formData.latitude,
//         longitude: formData.longitude,
//       });

//       console.log("API Response:", response.data);
//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: "Product added successfully!",
//       });
//     } catch (error) {
//       console.error("Error sending data:", error);
//       toast.error("Error adding product. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="">
//       <Header onUserDataFetched={handleUserDataFetched} />
//       <Sidenav />

//       <div className="ml-0 lg:ml-44 p-5 xl:pt-32 xl:pl-14 overflow-auto bg-slate-50 min-h-screen">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex justify-between items-center mb-5">
//             <div>
//               <h2
//                 className={`${GDSageBold.className} text-4xl text-black font-bold`}
//               >
//                 New product
//               </h2>
//             </div>
//           </div>
//           <form onSubmit={handleSubmit}>
//             <div className="lg:flex gap-5">
//               <div className="lg:w-8/12">
//                 <div className="bg-white p-4 rounded-lg border border-slate-200">
//                   <h4 className="text-md font-semibold pb-4 -ml-4 px-4 -mr-4 border-b border-slate-200 mb-4">
//                     Basic Informations
//                   </h4>
// <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//   <div className="mb-4">
//     <label
//       className="block text-gray-900 text-[13px] font-bold mb-2"
//       htmlFor="label"
//     >
//       Product name
//     </label>
//     <input
//       className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//       id="label"
//       type="text"
//       name="label"
//       value={formData.label}
//       onChange={handleInputChange}
//       autoComplete="off"
//     />
//   </div>
//                     <div className="mb-4">
//                       <label
//                         className="block text-gray-900 text-[13px] font-bold mb-2"
//                         htmlFor="slug"
//                       >
//                         Product slug
//                       </label>
//                       <input
//                         className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         id="slug"
//                         name="slug"
//                         value={formData.slug}
//                         onChange={handleInputChange}
//                         disabled
//                         type="text"
//                         autoComplete="off"
//                       />
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="mb-4">
//                       <label
//                         className="block text-gray-900 text-[13px] font-bold mb-2"
//                         htmlFor="category"
//                       >
//                         Product category
//                       </label>
//                       <select
//                         id="category"
//                         name="category"
//                         value={formData.category}
//                         onChange={handleChange}
//                         className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         required
//                       >
//                         <option value="" disabled>
//                           Select a category
//                         </option>
//                         {categories.map((category) => (
//                           <option key={category.id} value={category.id}>
//                             {category.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="mb-4">
//                       <label
//                         className="block text-gray-900 text-[13px] font-bold mb-2"
//                         htmlFor="service"
//                       >
//                         Service type
//                       </label>
//                       <select
//                         id="service"
//                         name="service"
//                         value={formData.service}
//                         onChange={handleChange}
//                         className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         required
//                       >
//                         <option value="" disabled>
//                           Select a service
//                         </option>
//                         {services.map((service) => (
//                           <option key={service.id} value={service.id}>
//                             {service.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1">
//                     <div className="mb-4">
//                       <label
//                         className="block text-gray-900 text-[13px] font-bold mb-2"
//                         htmlFor="description"
//                       >
//                         Product description
//                       </label>
//                       <textarea
//                         className="shadow min-h-28 max-h-28 appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         id="description"
//                         name="description"
//                         value={formData.description}
//                         onChange={handleInputChange}
//                         autoComplete="off"
//                       ></textarea>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-white p-4 rounded-lg border border-slate-200 mt-4">
//                   <h4 className="text-md font-semibold pb-4 -ml-4 px-4 -mr-4 border-b border-slate-200 mb-4">
//                     Set Your Salon Opening Hours
//                   </h4>
//                   <div className="space-y-4">
//                     {businessHours.map((day, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center justify-between"
//                       >
//                         <div className="flex items-center space-x-2">
//                           <label className="flex items-center">
//                             <input
//                               type="checkbox"
//                               className="toggle-checkbox hidden"
//                               checked={day.open}
//                               onChange={() => toggleDay(index)}
//                             />
//                             <div className="toggle-slot w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out">
//                               <div
//                                 className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${
//                                   day.open ? "translate-x-2 bg-[#b64077]" : ""
//                                 }`}
//                               ></div>
//                             </div>
//                           </label>
//                           <span className="text-gray-800">{day.name}</span>
//                           <span
//                             className={`status ${
//                               day.open ? "text-[#b64077]" : "text-gray-600"
//                             }`}
//                           >
//                             {day.open ? "Open" : "Closed"}
//                           </span>
//                         </div>
//                         <div
//                           className={`hours flex items-center space-x-2 ${
//                             day.open ? "" : "hidden"
//                           }`}
//                         >
//                           <input
//                             type="time"
//                             value={day.start}
//                             className="border border-gray-300 rounded px-2 py-1 text-gray-800"
//                             onChange={(e) =>
//                               updateHours(index, "start", e.target.value)
//                             }
//                             disabled={!day.open}
//                           />
//                           <span>–</span>
//                           <input
//                             type="time"
//                             value={day.end}
//                             className="border border-gray-300 rounded px-2 py-1 text-gray-800"
//                             onChange={(e) =>
//                               updateHours(index, "end", e.target.value)
//                             }
//                             disabled={!day.open}
//                           />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <div className="lg:w-4/12">
//                 <div className="bg-white p-4 rounded-lg border border-slate-200">
//                   <h4 className="text-md font-semibold pb-4 -ml-4 px-4 -mr-4 border-b border-slate-200 mb-4">
//                     Product photos
//                   </h4>
//                   <div className="flex justify-center items-center text-center bg-violet-100 rounded-lg h-72 relative mb-4">
//                     <input
//                       type="file"
//                       className="absolute inset-0 opacity-0 cursor-pointer"
//                       onChange={handleImageChange}
//                     />
//                     <div className="text-center">
//                       {profileImage ? (
//                         <img
//                           src={
//                             typeof profileImage === "string"
//                               ? profileImage
//                               : URL.createObjectURL(new Blob([profileImage]))
//                           }
//                           alt="Profile"
//                           className="h-full w-full object-cover rounded-full"
//                         />
//                       ) : (
//                         <>
//                           <BsCamera className="size-8 text-violet-500 text-center" />
//                           <p className="text-violet-500">Add a photo</p>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex justify-center items-center text-center bg-violet-100 rounded-lg h-72 relative">
//                     <input
//                       type="file"
//                       className="absolute inset-0 opacity-0 cursor-pointer"
//                       onChange={handleGalleryChange}
//                       multiple
//                     />
//                     <div className="text-center">
//                       {galleryPreviews.length > 0 ? (
//                         galleryPreviews.map((preview, index) => (
//                           <img
//                             key={index}
//                             src={preview}
//                             alt={`Gallery ${index}`}
//                             className="h-20 w-20 object-cover rounded-full mb-2"
//                           />
//                         ))
//                       ) : (
//                         <>
//                           <BsCamera className="size-8 text-violet-500 text-center" />
//                           <p className="text-violet-500">Add gallery photos</p>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//     <div className="bg-white p-4 rounded-lg border border-slate-200 mt-4">
//       <h4 className="text-md font-semibold pb-4 -ml-4 px-4 -mr-4 border-b border-slate-200 mb-4">
//         Location
//       </h4>
//       <div className="mb-4">
//         <label
//           className="block text-gray-900 text-[13px] font-bold mb-2"
//           htmlFor="Address"
//         >
//           Address
//         </label>
//         <input
//           className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//           id="Address"
//           type="text"
//           name="Address"
//           value={address}
//           onChange={handleAddressChange}
//           autoComplete="off"
//         />
//       </div>
//       {suggestions.length > 0 && (
//         <div className="mt-2">
//           {suggestions.map((suggestion, index) => (
//             <div
//               key={index}
//               className="cursor-pointer p-2 border-b border-gray-200"
//               onClick={() => handleSuggestionClick(suggestion)}
//             >
//               {suggestion}
//             </div>
//           ))}
//         </div>
//       )}
//       <div className="h-96">
//         <Map
//           ref={mapRef}
//           initialViewState={{
//             longitude: selectedLocation ? selectedLocation[0] : 0,
//             latitude: selectedLocation ? selectedLocation[1] : 0,
//             zoom: 12,
//           }}
//           style={{ width: "100%", height: "100%" }}
//           mapStyle="mapbox://styles/mapbox/streets-v11"
//           mapboxAccessToken={MAPBOX_TOKEN}
//         >
//           {selectedLocation && (
//             <Marker
//               longitude={selectedLocation[0]}
//               latitude={selectedLocation[1]}
//             />
//           )}
//         </Map>
//       </div>
//     </div>
//   </div>
// </div>
//             <button
//               type="submit"
//               className="py-2 px-4 rounded bg-slate-900 text-white font-semibold"
//               disabled={loading}
//             >
//               {loading ? "Saving..." : "Save"}
//             </button>
//           </form>
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default ProductAdd;

// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import localFont from "next/font/local";
// import Header from "../../Header/Header";
// import Sidenav from "../../../Businesses/Sidenav";
// import api from "@/services/auth";

// interface UserData {
//   id: string;
//   first_name: string;
// }

// interface Category {
//   id: number;
//   label: string;
// }

// interface Service {
//   id: number;
//   name: string;
// }

// const GDSageBold = localFont({
//   src: "../../../../../../fonts/GDSage-Bold.ttf",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// const AddArticle = () => {
//   const [formData, setFormData] = useState({
//     status: "published",
//     label: "",
//     slug: "",
//     description: "",
//     featured_image: "",
//     galleries: {
//       create: [
//         { articles_id: "+", directus_files_id: { id: "" } },
//         { articles_id: "+", directus_files_id: { id: "" } },
//         { articles_id: "+", directus_files_id: { id: "" } },
//       ],
//     },
//     category: 1,
//     service: {
//       create: [{ articles_id: "+", Services_id: { id: 18 } }],
//     },
//     Address: "",
//     monday_open: "",
//     monday_close: "",
//     tuesday_open: "",
//     tuesday_close: "",
//     wednesday_open: "",
//     wednesday_close: "",
//     thursday_open: "",
//     thursday_close: "",
//     friday_open: "",
//     friday_close: "",
//     saturday_open: "",
//     saturday_close: "",
//     sunday_open: "",
//     sunday_close: "",
//   });

//   const [userData, setUserData] = useState<UserData | null>(null);
//   const handleUserDataFetched = (data: UserData | null) => {
//     setUserData(data);
//   };

//   const [categories, setCategories] = useState<Category[]>([]);
//   const [services, setServices] = useState<Service[]>([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await api.get("/users/me", {
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
//             category: categoryData[0].id,
//           }));
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     const fetchServices = async () => {
//       if (formData.category) {
//         try {
//           const response = await api.get(
//             `/items/Categorie/${formData.category}`,
//             {
//               params: {
//                 fields: "services.Services_id.name",
//               },
//             }
//           );
//           const serviceData = response.data.data.services.map(
//             (service: any) => ({
//               id: service.Services_id.id,
//               name: service.Services_id.name,
//             })
//           );
//           setServices(serviceData);
//         } catch (error) {
//           console.error("Error fetching services:", error);
//         }
//       }
//     };

//     fetchServices();
//   }, [formData.category]);

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleGalleryChange = (
//     index: number,
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { value } = e.target;
//     setFormData((prevData) => {
//       const newGalleries = [...prevData.galleries.create];
//       newGalleries[index].directus_files_id.id = value;
//       return {
//         ...prevData,
//         galleries: {
//           ...prevData.galleries,
//           create: newGalleries,
//         },
//       };
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://109.199.103.20:2022/items/articles",
//         formData
//       );
//       console.log("Article created:", response.data);
//     } catch (error) {
//       console.error("Error creating article:", error);
//     }
//   };

//   return (
//     <>
//       <Header onUserDataFetched={handleUserDataFetched} />
//       <Sidenav />

//       <div className="ml-0 lg:ml-44 p-5 xl:pt-32 xl:pl-14 overflow-auto bg-slate-50 min-h-screen">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex justify-between items-center mb-5">
//             <div>
//               <h2
//                 className={`${GDSageBold.className} text-4xl text-black font-bold`}
//               >
//                 New product
//               </h2>
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default AddArticle;

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import localFont from "next/font/local";
import Header from "../../Header/Header";
import Sidenav from "../../../Businesses/Sidenav";
import api from "@/services/auth";

interface UserData {
  id: string;
  first_name: string;
}

interface Category {
  id: number;
  label: string;
}

interface Service {
  id: number;
  name: string;
}

interface BusinessHour {
  name: string;
  open: boolean;
  start: string;
  end: string;
}

const GDSageBold = localFont({
  src: "../../../../../../fonts/GDSage-Bold.ttf",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const days = [
  { name: "Monday", open: true, start: "--:--", end: "--:--" },
  { name: "Tuesday", open: true, start: "--:--", end: "--:--" },
  { name: "Wednesday", open: true, start: "--:--", end: "--:--" },
  { name: "Thursday", open: true, start: "--:--", end: "--:--" },
  { name: "Friday", open: true, start: "--:--", end: "--:--" },
  { name: "Saturday", open: false, start: "--:--", end: "--:--" },
  { name: "Sunday", open: false, start: "--:--", end: "--:--" },
];

const AddArticle = () => {
  const [formData, setFormData] = useState<{
    status: string;
    label: string;
    slug: string;
    description: string;
    featured_image: string;
    galleries: {
      create: {
        articles_id: string;
        directus_files_id: { id: string };
      }[];
    };
    category: string;
    service: {
      create: {
        articles_id: string;
        Services_id: { id: number | null };
      }[];
    };
    Address: string;
    businessHours: {
      monday: { open: string; close: string };
      tuesday: { open: string; close: string };
      wednesday: { open: string; close: string };
      thursday: { open: string; close: string };
      friday: { open: string; close: string };
      saturday: { open: string; close: string };
      sunday: { open: string; close: string };
    };
  }>({
    status: "published",
    label: "",
    slug: "",
    description: "",
    featured_image: "",
    galleries: {
      create: [
        { articles_id: "+", directus_files_id: { id: "" } },
        { articles_id: "+", directus_files_id: { id: "" } },
        { articles_id: "+", directus_files_id: { id: "" } },
      ],
    },
    category: "",
    service: {
      create: [
        {
          articles_id: "+",
          Services_id: { id: null },
        },
      ],
    },
    Address: "",
    businessHours: {
      monday: { open: "10:18 AM", close: "11:18 AM" },
      tuesday: { open: "", close: "" },
      wednesday: { open: "", close: "" },
      thursday: { open: "09:24 AM", close: "09:24 AM" },
      friday: { open: "09:23 AM", close: "09:23 AM" },
      saturday: { open: "", close: "" },
      sunday: { open: "", close: "" },
    },
  });

  const [userData, setUserData] = useState<UserData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>(days);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/users/me", {
          params: {
            fields: "category.Categorie_id.id,category.Categorie_id.label",
          },
        });
        const categoryData = response.data.data.category.map((cat: any) => ({
          id: cat.Categorie_id.id,
          label: cat.Categorie_id.label,
        }));
        setCategories(categoryData);

        // Set first category if available
        if (categoryData.length > 0) {
          setFormData((prev) => ({
            ...prev,
            category: categoryData[0].id,
          }));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch services based on selected category
  useEffect(() => {
    const fetchServices = async () => {
      if (formData.category) {
        try {
          const response = await api.get(
            `/items/Categorie/${formData.category}`,
            {
              params: {
                fields: "services.Services_id.id,services.Services_id.name",
              },
            }
          );
          const serviceData = response.data.data.services.map(
            (service: any) => ({
              id: service.Services_id.id,
              name: service.Services_id.name,
            })
          );
          setServices(serviceData);

          // Set first service if available
          if (serviceData.length > 0) {
            setFormData((prev) => ({
              ...prev,
              service: {
                create: [
                  {
                    articles_id: "+",
                    Services_id: { id: serviceData[0].id },
                  },
                ],
              },
            }));
          }
        } catch (error) {
          console.error("Error fetching services:", error);
        }
      }
    };

    fetchServices();
  }, [formData.category]);

  const handleUserDataFetched = (data: UserData | null) => {
    setUserData(data);
  };

  // Change handler with type safety
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
  
    console.log(`Field name: ${name}, Field value: ${value}`); // Debugging log
  
    // Handle business hours separately
    if (name.includes("_")) {
      const [dayOfWeek, timeField] = name.split("_");
      setFormData((prev) => {
        const newBusinessHours = {
          ...prev.businessHours,
          [dayOfWeek]: {
            ...prev.businessHours[dayOfWeek as keyof typeof prev.businessHours],
            [timeField]: value,
          },
        };
        console.log(`Updated businessHours: ${JSON.stringify(newBusinessHours)}`); // Debugging log
        return {
          ...prev,
          businessHours: newBusinessHours,
        };
      });
    } else {
      setFormData((prev) => {
        const newFormData = {
          ...prev,
          [name]: value,
        };
        console.log(`Updated formData: ${JSON.stringify(newFormData)}`); // Debugging log
        return newFormData;
      });
    }
  };
  

  // Gallery change handler
  const handleGalleryChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const newGalleries = [...prevData.galleries.create];
      newGalleries[index].directus_files_id.id = value;
      return {
        ...prevData,
        galleries: {
          ...prevData.galleries,
          create: newGalleries,
        },
      };
    });
  };

  // Submit handler with improved validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Comprehensive validation
    const requiredFields = [
      "label",
      "slug",
      "description",
      "category",
      "featured_image",
      "Address",
    ];

    const missingFields = requiredFields.filter(
      (field) => !(formData as { [key: string]: any })[field]
    );

    if (missingFields.length > 0) {
      console.error(
        `Please fill all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    // Validate service
    if (!formData.service.create[0].Services_id.id) {
      console.error("Please select a service");
      return;
    }

    // Validate gallery images
    const incompleteGalleries = formData.galleries.create.filter(
      (gallery) => !gallery.directus_files_id.id
    );

    if (incompleteGalleries.length > 0) {
      console.error("Please provide all gallery image IDs");
      return;
    }

    try {
      // Prepare the business hours data
      const businessHours = Object.entries(formData.businessHours).reduce(
        (acc, [dayOfWeek, { open, close }]) => {
          acc[dayOfWeek] = { open: open || "", close: close || "" };
          return acc;
        },
        {} as { [key: string]: { open: string; close: string } }
      );

      // Prepare the payload
      const payload = {
        ...formData,
        businessHours,
      };

      const response = await axios.post(
        "http://109.199.103.20:2022/items/articles",
        payload
      );
      console.log("Article created:", response.data);
    } catch (error) {
      console.error("Error creating article:", error);
    }
  };

  const toggleDay = (index: number) => {
    const newBusinessHours = [...businessHours];
    newBusinessHours[index].open = !newBusinessHours[index].open;
    setBusinessHours(newBusinessHours);

    setFormData((prevData) => ({
      ...prevData,
      [`${String(index).toLowerCase()}_open`]: newBusinessHours[index].open
        ? businessHours[index].start
        : "",
      [`${String(index).toLowerCase()}_close`]: newBusinessHours[index].open
        ? businessHours[index].end
        : "",
    }));
  };

  const updateHours = (
    index: number,
    type: keyof BusinessHour,
    value: string | boolean
  ) => {
    const newBusinessHours = [...businessHours];
    // @ts-ignore
    newBusinessHours[index][type] = value;
    setBusinessHours(newBusinessHours);

    setFormData((prevData) => ({
      ...prevData,
      [`${String(index).toLowerCase()}_${type}`]: value,
    }));
  };

  return (
    <>
      <Header onUserDataFetched={handleUserDataFetched} />
      <Sidenav />

      <div className="ml-0 lg:ml-44 p-5 xl:pt-32 xl:pl-14 overflow-auto bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2
                className={`${GDSageBold.className} text-4xl text-black font-bold`}
              >
                New product
              </h2>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Label (Product Name)</label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div>
              <label>Slug (Product Slug)</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div>
              <label>Description (Product Description)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="shadow appearance-none min-h-28 max-h-28 border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div>
              <label>Category (Product Category)</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Service (Product Service)</label>
              <select
                name="service"
                value={formData.service.create[0].Services_id.id ?? ""}
                onChange={(e) => {
                  const { value } = e.target;
                  setFormData((prevData) => ({
                    ...prevData,
                    service: {
                      create: [
                        {
                          articles_id: "+",
                          Services_id: {
                            id: value ? parseInt(value) : null,
                          },
                        },
                      ],
                    },
                  }));
                }}
                required
                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="" disabled>
                  Select a service
                </option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Address (Product Address)</label>
              <input
                type="text"
                name="Address"
                value={formData.Address}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div>
  <label>Featured Image</label>
  <input
    type="text"
    name="featured_image"
    value={formData.featured_image}
    onChange={handleChange}
    required
    className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  />
</div>


            <div>
              <label>Gallery Images</label>
              {formData.galleries.create.map((gallery, index) => (
                <input
                  key={index}
                  type="text"
                  value={gallery.directus_files_id.id}
                  onChange={(e) => handleGalleryChange(index, e)}
                  required
                />
              ))}
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 mt-4">
              <h4 className="text-md font-semibold pb-4 -ml-4 px-4 -mr-4 border-b border-slate-200 mb-4">
                Set Your Salon Opening Hours
              </h4>
              <div className="space-y-4">
                {businessHours.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="toggle-checkbox hidden"
                          checked={day.open}
                          onChange={() => toggleDay(index)}
                        />
                        <div className="toggle-slot w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out">
                          <div
                            className={`toggle-dot w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${
                              day.open ? "translate-x-2 bg-[#b64077]" : ""
                            }`}
                          ></div>
                        </div>
                      </label>
                      <span className="text-gray-800">{day.name}</span>
                      <span
                        className={`status ${
                          day.open ? "text-[#b64077]" : "text-gray-600"
                        }`}
                      >
                        {day.open ? "Open" : "Closed"}
                      </span>
                    </div>
                    <div
                      className={`hours flex items-center space-x-2 ${
                        day.open ? "" : "hidden"
                      }`}
                    >
                      <input
                        type="time"
                        value={day.start}
                        className="border border-gray-300 rounded px-2 py-1 text-gray-800"
                        onChange={(e) =>
                          updateHours(index, "start", e.target.value)
                        }
                        disabled={!day.open}
                      />
                      <span>–</span>
                      <input
                        type="time"
                        value={day.end}
                        className="border border-gray-300 rounded px-2 py-1 text-gray-800"
                        onChange={(e) =>
                          updateHours(index, "end", e.target.value)
                        }
                        disabled={!day.open}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddArticle;

