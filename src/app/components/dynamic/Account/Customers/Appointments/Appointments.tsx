"use client";
import React, { useState, useEffect } from "react";
import BookingHeader from "../../../../global/booking-header/BookingHeader";
import Sidenav from "../Profile/Sidenav";

const Appointments = () => {
  // Mock data simulating the appointments you have booked
  const [appointments, setAppointments] = useState<any[]>([
    {
      serviceType: "Home Cleaning",
      appointmentDate: "2024-12-10",
      appointmentTime: "10:00 AM",
      address: "123 Main St, City, Country",
    },
    {
      serviceType: "Office Cleaning",
      appointmentDate: "2024-12-11",
      appointmentTime: "2:00 PM",
      address: "456 Office Blvd, Business District, City",
    },
    {
      serviceType: "Garden Maintenance",
      appointmentDate: "2024-12-12",
      appointmentTime: "9:00 AM",
      address: "789 Green St, Suburb, Country",
    },
  ]);

  return (
    <>
      <div className="hidden lg:block">
        <BookingHeader />
        <Sidenav />
      </div>
      <div className="ml-0 lg:ml-64 p-5 xl:pt-32 xl:pl-14 overflow-auto bg-slate-100 h-screen">
        <h1 className="text-3xl font-bold mb-8 ">Your Appointments</h1>
        <div className="border-t border-gray-400 opacity-25 p-4 "></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.length > 0 ? (
            appointments.map((appointment, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg p-6">

                <p className="text-sm text-gray-500 mb-2">
                  <strong>Date:</strong> {appointment.appointmentDate}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  <strong>Time:</strong> {appointment.appointmentTime}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  <strong>Address:</strong> {appointment.address}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <button className="text-blue-600 hover:text-blue-400 text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center flex justify-center items-center text-ellipsis text-lg *">
              <p>No appointments found.</p>
            </div>
          )}
        </div>
      </div>

    {/*test  */}

    

    </>
  );
};

export default Appointments;
