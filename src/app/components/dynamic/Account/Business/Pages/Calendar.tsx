// import React from "react";
// import {
//   ScheduleComponent,
//   Day,
//   Inject,
//   ViewsDirective,
//   ViewDirective,
//   EventSettingsModel
// } from "@syncfusion/ej2-react-schedule";

// // Ensure proper date formatting for Syncfusion
// const formatEvents = (events: any[]) => {
//   return events.map(event => ({
//     ...event,
//     StartTime: new Date(event.StartTime),
//     EndTime: new Date(event.EndTime)
//   }));
// };

// const Calendar = () => {
//   const appData = [
//     {
//       Id: 1,
//       Subject: "Meeting",
//       StartTime: new Date(2018, 1, 15, 10, 0),
//       EndTime: new Date(2018, 1, 15, 11, 30),
//     },
//     // Add more events as needed
//   ];

//   const eventSettings: EventSettingsModel = { 
//     dataSource: formatEvents(appData) 
//   };

//   const timeScale = { 
//     enable: true, 
//     slotCount: 5 
//   };

//   return (
//     <ScheduleComponent
//       width="100%"
//       height="550px"
//       selectedDate={new Date(2018, 1, 15)}
//       eventSettings={eventSettings}
//     >
//       <ViewsDirective>
//         <ViewDirective
//           option="Day"
//           startHour="09:30"
//           endHour="18:00"
//           timeScale={timeScale}
//         />
//       </ViewsDirective>
//       <Inject services={[Day]} />
//     </ScheduleComponent>
//   );
// };

// export default Calendar;
"use client";

import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Sidenav from '../../Businesses/Sidenav';
import Header from '../Header/Header';

const localizer = momentLocalizer(moment);

const BookingCalendar: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings'); // Adjust the endpoint as necessary
      const data = await response.json();
      const formattedEvents = data.map((booking: any) => ({
        start: new Date(booking.start),
        end: new Date(booking.end),
        title: booking.title,
        isBooked: true, // Add a property to indicate it's a booked event
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);



  const eventStyleGetter = (event: any) => {
    const backgroundColor = event.isBooked ? '#ffcccb' : '#ffffff'; // Highlight booked events
    const style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'black',
      border: '0px',
      display: 'block',
    };
    return {
      style,
    };
  };

  return (
    <>
      <Header  />
      <Sidenav />
      <div className="ml-0 lg:ml-44 p-5 xl:pt-32 xl:pl-14 overflow-auto bg-slate-50 min-h-screen ">
        <h2 className="text-2xl font-bold ">Your Bookings</h2>
        <div className='border-t border-gray-400 opacity-25 py-4 mt-5'></div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            selectable={false}
            eventPropGetter={eventStyleGetter} 
          />
        </div>
      </div>
    </>
  );
};

export default BookingCalendar;
