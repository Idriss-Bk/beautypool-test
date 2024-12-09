// src/data/mockData.ts

export const mockData = {
  venues: [
    {
      id: "1",
      name: "Downtown Spa & Wellness",
      address: "123 Main Street, Downtown",
      description: "Luxury spa in the heart of downtown",
      image: "/images/downtown-spa.jpg",
      coordinates: {
        latitude: 40.7128,
        longitude: -74.006,
      },
      active: true,
    },
    {
      id: "2",
      name: "Westside Beauty Center",
      address: "456 West Avenue",
      description: "Modern beauty treatments in a peaceful setting",
      image: "/images/westside-beauty.jpg",
      coordinates: {
        latitude: 40.7589,
        longitude: -73.9851,
      },
      active: true,
    },
  ],

  treatments: [
    {
      id: "1",
      name: "Swedish Massage",
      description: "60-minute relaxing massage",
      duration: 60,
      price: 89.99,
      image: "/images/swedish-massage.jpg",
      active: true,
    },
    {
      id: "2",
      name: "Deep Tissue Massage",
      description: "60-minute deep tissue massage",
      duration: 60,
      price: 99.99,
      image: "/images/deep-tissue.jpg",
      active: true,
    },
    {
      id: "3",
      name: "Facial Treatment",
      description: "45-minute facial treatment",
      duration: 45,
      price: 79.99,
      image: "/images/facial.jpg",
      active: true,
    },
  ],

  timeSlots: [
    {
      id: "1",
      venueId: "1",
      startTime: "09:00",
      endTime: "17:00",
      daysAvailable: [1, 2, 3, 4, 5], // Monday to Friday
      intervals: 60, // minutes
    },
    {
      id: "2",
      venueId: "2",
      startTime: "10:00",
      endTime: "18:00",
      daysAvailable: [1, 2, 3, 4, 5, 6], // Monday to Saturday
      intervals: 60, // minutes
    },
  ],

  // Store existing bookings
  bookings: [
    {
      id: "1",
      venueId: "1",
      treatmentId: "1",
      userId: "user1",
      bookingDate: "2024-11-25",
      startTime: "10:00",
      endTime: "11:00",
      status: "confirmed",
    },
  ],
};

// Utility function to generate available time slots for a given date and venue
export const generateTimeSlots = (date: Date, venueId: string) => {
  const dayOfWeek = date.getDay();
  const venue = mockData.timeSlots.find((v) => v.venueId === venueId);

  if (!venue || !venue.daysAvailable.includes(dayOfWeek)) {
    return [];
  }

  const slots = [];
  const [startHour, startMinute] = venue.startTime.split(":").map(Number);
  const [endHour, endMinute] = venue.endTime.split(":").map(Number);

  let currentTime = new Date(date);
  currentTime.setHours(startHour, startMinute, 0);

  const endTime = new Date(date);
  endTime.setHours(endHour, endMinute, 0);

  while (currentTime < endTime) {
    // Check if slot is already booked
    const timeString = currentTime.toTimeString().slice(0, 5);
    const isBooked = mockData.bookings.some(
      (booking) =>
        booking.venueId === venueId &&
        booking.bookingDate === date.toISOString().split("T")[0] &&
        booking.startTime === timeString
    );

    if (!isBooked) {
      slots.push({
        time: timeString,
        available: true,
      });
    }

    currentTime.setMinutes(currentTime.getMinutes() + venue.intervals);
  }

  return slots;
};

// Utility function to check if a slot is available
export const isSlotAvailable = (
  date: string,
  time: string,
  venueId: string,
  treatmentId: string
) => {
  const treatment = mockData.treatments.find((t) => t.id === treatmentId);
  if (!treatment) return false;

  const existingBooking = mockData.bookings.find(
    (booking) =>
      booking.venueId === venueId &&
      booking.bookingDate === date &&
      booking.startTime === time
  );

  return !existingBooking;
};

// Utility function to create a new booking
export const createBooking = (bookingData: {
  venueId: string;
  treatmentId: string;
  userId: string;
  bookingDate: string;
  startTime: string;
}) => {
  const treatment = mockData.treatments.find(
    (t) => t.id === bookingData.treatmentId
  );
  if (!treatment) throw new Error("Treatment not found");

  const endTime = new Date(
    `${bookingData.bookingDate}T${bookingData.startTime}`
  );
  endTime.setMinutes(endTime.getMinutes() + treatment.duration);

  const newBooking = {
    id: (mockData.bookings.length + 1).toString(),
    ...bookingData,
    endTime: endTime.toTimeString().slice(0, 5),
    status: "confirmed",
  };

  mockData.bookings.push(newBooking);
  return newBooking;
};
