// components/TimeInput.tsx
import React from 'react';

interface TimeInputProps {
  day: string;
  openTime: string;
  closeTime: string;
  handleTimeChange: (day: string, type: string, value: string) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ day, openTime, closeTime, handleTimeChange }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="w-1/4 font-bold text-gray-700">{day}</div>
    <div className="w-1/3">
      <input
        type="time"
        value={openTime}
        onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
        className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div className="w-1/3">
      <input
        type="time"
        value={closeTime}
        onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
        className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
);

export default TimeInput;
