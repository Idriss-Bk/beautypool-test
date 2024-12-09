// import React, { useState } from 'react';

// const BookDashboard = ({ searchTerm }) => {
//   const bookings = [
//     { id: 1, clientName: 'John Doe', date: '12/12/2024', time: '10:00 AM', status: 'Confirmed' },
//     { id: 2, clientName: 'Jane Smith', date: '13/12/2024', time: '02:00 PM', status: 'Pending' },
//     { id: 3, clientName: 'James Bond', date: '15/12/2024', time: '09:00 AM', status: 'Confirmed' },
//     // More bookings
//   ];

//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [action, setAction] = useState('');

//   const filteredBookings = bookings.filter((booking) =>
//     booking.clientName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleActionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setAction(event.target.value);
//   };

//   const handleSendAction = () => {
//     if (selectedBooking && action) {
//       alert(`Booking with client ${selectedBooking.clientName} has been ${action}!`);
//       // Further logic can be added here for actual status update
//     }
//   };

//   return (
//     <div className="flex-1 p-8">
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-3xl font-semibold">Manage Bookings</h2>
//       </div>

//       {/* Booking List */}
//       <div className="bg-white shadow-lg rounded-lg p-6">
//         <table className="min-w-full table-auto">
//           <thead>
//             <tr className="border-b-2 border-gray-400">
//               <th className="px-4 py-2 text-left">Client Name</th>
//               <th className="px-4 py-2 text-left">Date</th>
//               <th className="px-4 py-2 text-left">Time</th>
//               <th className="px-4 py-2 text-left">Status</th>
//               <th className="px-4 py-2 text-left">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredBookings.map((booking) => (
//               <tr key={booking.id} className="border-b border-gray-200">
//                 <td className="px-4 py-2">{booking.clientName}</td>
//                 <td className="px-4 py-2">{booking.date}</td>
//                 <td className="px-4 py-2">{booking.time}</td>
//                 <td className="px-4 py-2">{booking.status}</td>
//                 <td className="px-4 py-2">
//                   <button
//                     className="text-blue-500 hover:underline"
//                     onClick={() => setSelectedBooking(booking)}
//                   >
//                     Choose
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {selectedBooking && (
//         <div className="mt-8 bg-white p-6 shadow-lg rounded-lg">
//           <h3 className="text-xl font-semibold mb-4">Booking Action</h3>
//           <p className="mb-4">Booking for {selectedBooking.clientName} on {selectedBooking.date} at {selectedBooking.time}</p>

//           <select
//             value={action}
//             onChange={handleActionChange}
//             className="border p-2 mb-4 rounded-lg w-full"
//           >
//             <option value="">Select Action</option>
//             <option value="Confirm">Confirm</option>
//             <option value="Cancel">Cancel</option>
//           </select>

//           <button
//             className="bg-red-500 text-white p-2 rounded-lg"
//             onClick={handleSendAction}
//           >
//             Send
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookDashboard;


import React from 'react'

interface BookDashboardProps {
  searchTerm: string;
}

const BookDashboard: React.FC<BookDashboardProps> = ({ searchTerm }) => {
  return (
    <div>BookDashboard</div>
  )
}

export default BookDashboard