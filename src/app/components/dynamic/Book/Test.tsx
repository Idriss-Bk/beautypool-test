"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/auth";
import { IoLocationOutline } from "react-icons/io5";

// Mock data
const VENUES_AND_TREATMENTS = [
  {
    id: "1",
    name: "Downtown Spa - Swedish Massage",
    venue: "Downtown Spa",
    treatment: "Swedish Massage",
    duration: 60,
    price: 89.99,
  },
  {
    id: "2",
    name: "Downtown Spa - Deep Tissue Massage",
    venue: "Downtown Spa",
    treatment: "Deep Tissue Massage",
    duration: 60,
    price: 99.99,
  },
  {
    id: "3",
    name: "Beach Resort Spa - Facial Treatment",
    venue: "Beach Resort Spa",
    treatment: "Facial Treatment",
    duration: 45,
    price: 79.99,
  },
];

// Generate time slots from 9 AM to 5 PM
const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => {
  const hour = Math.floor(i / 2) + 9;
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

export default function BookingForm() {
  const [venueAndTreatment, setVenueAndTreatment] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showFilter, setShowFilter] = React.useState(false);
  const [selectedTime, setSelectedTime] = React.useState("anytime");
  const [categories, setCategories] = useState<any[]>([]);
  const [fromTime, setFromTime] = React.useState("");
  const [toTime, setToTime] = React.useState("");

  const handleTimeSelection = (time: any) => {
    setSelectedTime(time);
    switch (time) {
      case "morning":
        setFromTime("06:00");
        setToTime("12:00");
        break;
      case "afternoon":
        setFromTime("12:00");
        setToTime("17:00");
        break;
      case "evening":
        setFromTime("17:00");
        setToTime("00:00");
        break;
      default:
        setFromTime("");
        setToTime("");
        break;
    }
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get("/items/categories");
        setCategories(response.data.data); // Storing data as an array
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Booking details:", {
        venueAndTreatment,
        location,
        date,
        time,
      });
      setLoading(false);

      // Redirect to the "book" page with query parameters
      const selected = VENUES_AND_TREATMENTS.find(
        (v) => v.id === venueAndTreatment
      );
      router.push(
        `/book?venue=${selected?.venue}&treatment=${selected?.treatment}&date=${date}&time=${time}&location=${location}&latitude=${currentLocation?.latitude}&longitude=${currentLocation?.longitude}`
      );

      // Reset form
      setVenueAndTreatment("");
      setLocation("");
      setDate("");
      setTime("");
    }, 1000);
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Venue and Treatment Selection */}
        <div className="lg:flex gap-2">
          <div className="lg:w-6/12">
            <div className="mb-2">
              {/* <select
                id="venueAndTreatment"
                value={venueAndTreatment}
                onChange={(e) => setVenueAndTreatment(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All treatments available</option>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))
                ) : (
                  <option>No categories available</option>
                )}
              </select> */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center border rounded-full px-4 py-2 space-x-2 w-full">
                  <i className="fas fa-search text-gray-500"></i>
                  <input
                    type="text"
                    placeholder="All treatments and venues"
                    className="outline-none w-full"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  />
                </div>
              </div>
              {dropdownOpen && (
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex items-center space-x-2 mb-4">
                    <div
                      className="w-7 h-7 bg-cover bg-center relative -top-1.5"
                      style={{
                        backgroundImage: `url(http://localhost:8055/assets/3ecb5a75-ab7e-4d31-b1ea-91a642ca59d0)`,
                      }}
                    ></div>
                    <span className="font-medium mb-3">All treatments</span>
                  </div>
                  <h2 className="font-semibold mb-3 uppercase text-xs">
                    Top categories
                  </h2>
                  <div className="space-y-4">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <div
                          className="flex items-center space-x-2"
                          key={category.id}
                        >
                          <div
                            className="w-7 h-7 bg-cover bg-center"
                            style={{
                              backgroundImage: `url(http://localhost:8055/assets/${category.image})`,
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
            {/* Location Search Input */}
            <div className="mb-2 lg:mb-0">
              <div className="flex items-center border rounded-full px-4 py-2 space-x-2">
                <IoLocationOutline className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Current location"
                  onChange={(e) => setLocation(e.target.value)}
                  value={location}
                  className="outline-none"
                />
              </div>
            </div>
          </div>
          <div className="lg:w-4/12">
            {/* Date Selection */}
            <div className="mb-2">
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Time Selection */}
            {/* <div>
              <select
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a time</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div> */}
            <div
              className="flex items-center space-x-2 bg-white rounded-full shadow-md p-2 cursor-pointer"
              onClick={() => setShowFilter(!showFilter)}
            >
              <i className="far fa-clock text-gray-500"></i>
              <span className="text-gray-500">Any time</span>
            </div>
          </div>
          <div className="lg:w-2/12 mt-3 lg:mt-0">
            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                loading || !venueAndTreatment || !location || !date || !time
              }
              className={`w-full py-8 px-4 rounded-md text-white font-medium ${
                loading || !venueAndTreatment || !location || !date || !time
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-zinc-800"
              }`}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
        {showFilter && (
          <div className="mt-4 bg-white rounded-lg shadow-md p-4">
            <div className="flex space-x-2 mb-4">
              <button
                className={`px-4 py-2 rounded-full ${
                  selectedTime === "anytime"
                    ? "bg-[#F4B8AE] text-slate-900"
                    : "border border-gray-300 text-gray-700"
                }`}
                onClick={() => handleTimeSelection("anytime")}
              >
                Any time
              </button>
              <button
                className={`px-4 py-2 rounded-full ${
                  selectedTime === "morning"
                    ? "bg-[#F4B8AE] text-slate-900"
                    : "border border-gray-300 text-gray-700"
                }`}
                onClick={() => handleTimeSelection("morning")}
              >
                Morning
              </button>
              <button
                className={`px-4 py-2 rounded-full ${
                  selectedTime === "afternoon"
                    ? "bg-[#F4B8AE] text-slate-900"
                    : "border border-gray-300 text-gray-700"
                }`}
                onClick={() => handleTimeSelection("afternoon")}
              >
                Afternoon
              </button>
              <button
                className={`px-4 py-2 rounded-full ${
                  selectedTime === "evening"
                    ? "bg-[#F4B8AE] text-slate-900"
                    : "border border-gray-300 text-gray-700"
                }`}
                onClick={() => handleTimeSelection("evening")}
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
                    <option key={i}>{i.toString().padStart(2, "0")}:00</option>
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
      </form>
    </div>
  );
}
