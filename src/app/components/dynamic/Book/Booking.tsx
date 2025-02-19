"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/auth";
import { IoLocationOutline } from "react-icons/io5";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";

type Location = {
  name: string;
  adminName1?: string;
  countryName?: string;
  latitude: number;
  longitude: number;
};

const reverseGeocode = async (latitude: number, longitude: number) => {
  const accessToken = "pk.eyJ1IjoiYW5pZmZvdXJkZXYiLCJhIjoiY2xvc28zMXJjMDM4dTJycXc0aHBkN2pmcyJ9.IEOWZZQT6rlwKckMaoTh8g"; // Replace with your Mapbox API key
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();

    // Check if data is available
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      return feature.place_name;
    } else {
      console.error("No data found");
      return "";
    }
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return "";
  }
};

export default function BookingForm() {
  const [venueAndTreatment, setVenueAndTreatment] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedTime, setSelectedTime] = useState("anytime");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const timePopupRef = useRef<HTMLDivElement>(null);

  const fetchLocations = async (query: string) => {
    const accessToken = "pk.eyJ1IjoiYW5pZmZvdXJkZXYiLCJhIjoiY2xvc28zMXJjMDM4dTJycXc0aHBkN2pmcyJ9.IEOWZZQT6rlwKckMaoTh8g"; // Replace with your Mapbox API key
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();

      // Check if data is available
      if (data.features) {
        return data.features.map((feature: any) => ({
          name: feature.place_name,
          latitude: feature.center[1],
          longitude: feature.center[0],
          adminName1: feature.context?.[0]?.text,
          countryName: feature.context?.[feature.context.length - 1]?.text,
        }));
      } else {
        console.error("No data found");
        return [];
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      return [];
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    if (value.length >= 2) {
      const locations = await fetchLocations(value);
      setResults(locations);
    } else {
      setResults([]);
    }
  };

  const handleTimeSelection = (timeSlot: string) => {
    setSelectedTime(timeSlot);

    // Set the actual time value based on the selection
    switch (timeSlot) {
      case "Morning":
        setTime("09:00");
        setFromTime("06:00");
        setToTime("12:00");
        break;
      case "Afternoon":
        setTime("13:00");
        setFromTime("12:00");
        setToTime("17:00");
        break;
      case "Evening":
        setTime("17:00");
        setFromTime("17:00");
        setToTime("00:00");
        break;
      case "Anytime":
        setTime("00:00"); // or whatever default you want
        setFromTime("");
        setToTime("");
        break;
    }

    // Close the time selection popup
    setShowFilter(false);
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get("/items/Categorie");
        setCategories(response.data.data); // Storing data as an array
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        const readableAddress = await reverseGeocode(latitude, longitude);
        setLocation(readableAddress); // Set the location input field with the readable address
      });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timePopupRef.current && !timePopupRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic validation
      if (!venueAndTreatment || !location || !date || !selectedTime || !selectedCategoryId) {
        throw new Error("Please fill in all required fields");
      }

      if (!currentLocation?.latitude || !currentLocation?.longitude) {
        throw new Error("Location coordinates are required");
      }

      // Create the booking object
      const bookingData = {
        venueAndTreatment,
        location,
        date,
        time: selectedTime,
        coordinates: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
      };

      // Log the booking data
      console.log("Booking details:", bookingData);

      // Save the selected category ID and location coordinates in local storage
      localStorage.setItem("selectedCategoryId", selectedCategoryId);
      localStorage.setItem("selectedLocation", JSON.stringify({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      }));

      // Construct the query parameters
      const queryParams = new URLSearchParams({
        venue: venueAndTreatment,
        date,
        time: selectedTime,
        location,
        latitude: currentLocation.latitude.toString(),
        longitude: currentLocation.longitude.toString(),
        categoryId: selectedCategoryId,
      });

      // Redirect to the booking page
      router.push(`/book?${queryParams.toString()}`);

      // Reset form
      setVenueAndTreatment("");
      setLocation("");
      setDate("");
      setTime("");
      setSelectedTime("anytime");
      setSelectedCategoryId(null);
    } catch (error) {
      console.error("Booking error:", error);
      // Here you could add user feedback for the error
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto bg-white  rounded-xl p-1 bg-gradient-to-b from-[#f4b9aed6] to-[#f4b9ae85]">
      <form onSubmit={handleSubmit} className="space-y-0 rounded-lg bg-white p-4">
  {/* Venue and Treatment Selection */}
  <div className="flex gap-3 md:flex-row">
    <div className="w-6/12 md:w-6/12 lg:w-7/12">
      {/* Location Search Input */}
      <div className="mb-2 lg:mb-0">
        <div className="flex items-center border rounded-full px-4 py-2 space-x-2">
          <IoLocationOutline className="text-gray-500" />
          <input
            type="text"
            placeholder="Current location"
            onChange={handleInputChange}
            value={location}
            className="outline-none w-full"
          />
        </div>
        {results.length > 0 && (
          <div className="mt-2 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto absolute w-auto">
            <ul>
              {results.map((result, index) => (
                <li
                  key={index}
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setLocation(result.name);
                    setCurrentLocation({
                      latitude: result.latitude,
                      longitude: result.longitude,
                    });
                    setResults([]);
                  }}
                >
                  <i className="fas fa-map-marker-alt text-gray-500 mr-2"></i>
                  <div>
                    <div className="font-semibold">{result.name}</div>
                    {result.adminName1 && (
                      <div className="text-sm text-gray-500">
                        {result.adminName1}
                      </div>
                    )}
                    {result.countryName && (
                      <div className="text-sm text-gray-500">
                        {result.countryName}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
    <div className="w-6/12 md:w-6/12 lg:w-5/12">
      <div className="mb-2">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center border rounded-full px-4 py-2 space-x-2 w-full">
            <BsSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="All treatments and venues"
              className="outline-none w-full"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              value={venueAndTreatment}
              onChange={(e) => setVenueAndTreatment(e.target.value)}
            />
          </div>
        </div>
        {dropdownOpen && (
          <div className="bg-white p-4 rounded-lg shadow-md absolute w-auto h-[250px] overflow-auto">
            <div className="flex items-center space-x-2 mb-4">
              {/* <div
                className="w-7 h-7 bg-cover bg-center relative -top-1.5"
                style={{
                  backgroundImage: `url(http://109.199.103.20:2022/assets/3ecb5a75-ab7e-4d31-b1ea-91a642ca59d0)`,
                }}
              ></div>
              <span className="font-medium mb-3">All treatments</span> */}

            </div>
            {/* <h2 className="font-normal mb-3 text-sm">Top categories</h2> */}
            <div className="space-y-4">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div
                    className="flex items-center space-x-2 p-[2px] pt-0 rounded"
                    key={category.id}
                    onClick={() => {
                      setVenueAndTreatment(category.label);
                      setSelectedCategoryId(category.id);
                      setDropdownOpen(false);
                    }}
                  >
                    <div
                      className="w-7 h-7 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(http://109.199.103.20:2022/assets/${category.icon})`,
                      }}
                    ></div>
                    <span>{category.label}</span>
                  </div>
                ))
              ) : (
                <option>No categories available</option>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  <div className="flex gap-3 md:flex-row">
    {/* Date Selection */}
    <div className="w-6/12 md:w-6/12 lg:w-4/12 mb-2">
      <input
        type="date"
        id="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        min={today}
        required
        className="w-full py-[4px] px-4 rounded-full  border border-gray-300  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
    {/* Time Selection */}
    <div className="w-6/12 md:w-6/12 lg:w-4/12 mb-2">
      <div className="flex items-center border rounded-full px-4 py-2 space-x-2">
        <AiOutlineClockCircle className="text-gray-500" />
        <input
          type="text"
          placeholder="Any time"
          className="outline-none w-full"
          onClick={() => setShowFilter(!showFilter)}
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        />
        {showFilter && (
          <div ref={timePopupRef} className="mt-4 bg-white rounded-lg shadow-md p-4 absolute w-auto">
            <div className="flex space-x-2 mb-4">
              <button
                className={`px-4 py-2 rounded-full ${
                  selectedTime === "Anytime"
                    ? "bg-[#eca4977c]] text-slate-900"
                    : "border border-gray-300 text-gray-700"
                }`}
                onClick={() => handleTimeSelection("Anytime")}
              >
                Any time
              </button>
              <button
                className={`px-4 py-2 rounded-full ${
                  selectedTime === "Morning"
                    ? "bg-[#eca4977c] text-slate-900"
                    : "border border-gray-300 text-gray-700"
                }`}
                onClick={() => handleTimeSelection("Morning")}
              >
                Morning
              </button>
              <button
                className={`px-4 py-2 rounded-full ${
                  selectedTime === "Afternoon"
                    ? "bg-[#eca4977c]] text-slate-900"
                    : "border border-gray-300 text-gray-700"
                }`}
                onClick={() => handleTimeSelection("Afternoon")}
              >
                Afternoon
              </button>
              <button
                className={`px-4 py-2 rounded-full ${
                  selectedTime === "Evening"
                    ? "bg-[#eca4977c]] text-slate-900"
                    : "border border-gray-300 text-gray-700"
                }`}
                onClick={() => handleTimeSelection("Evening")}
              >
                Evening
              </button>
            </div>
            <div className="flex space-x-2">
              <div className="relative w-1/2">
                <select
                  className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                >
                  <option>From</option>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i}>
                      {i.toString().padStart(2, "0")}:00
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M7 10l5 5 5-5H7z" />
                  </svg>
                </div>
              </div>
              <div className="relative w-1/2">
                <select
                  className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                >
                  <option>To</option>
                  {Array.from({ length: 23 }, (_, i) => (
                    <option key={i}>
                      {(i + 1).toString().padStart(2, "0")}:00
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M7 10l5 5 5-5H7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  <div className="flex lg:w-4/12">
    {/* Submit Button */}
    <button
      type="submit"
      disabled={
        loading ||
        !venueAndTreatment ||
        !location ||
        !date ||
        !selectedTime ||
        !selectedCategoryId
      }
      className={`w-full border rounded-full px-4 py-2 text-white font-medium ${
        loading ||
        !venueAndTreatment ||
        !location ||
        !date ||
        !selectedTime ||
        !selectedCategoryId
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-black hover:bg-zinc-800"
      }`}
    >
      {loading ? "Searching..." : "Search"}
    </button>
  </div>
</form>

    </div>
  );
}
