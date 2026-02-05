// import React from 'react';

// const BookingCard = ({ booking }) => {
//   return (
//     <div className="booking-card">
//       <h3>Booking Details</h3>
//       <p>Status: {booking?.status}</p>
//       <p>Date: {booking?.start_date}</p>
//       <p>Guests: {booking?.num_people}</p>
//       <p>Total: ${booking?.total_price_amount}</p>
//     </div>
//   );
// };

// export default BookingCard;


import { useState } from 'react';

// Replace with your actual backend URL
const API_URL = "http://localhost:5000/api/octo/bookings";

export default function BookingCard({ productId, availabilityId, price }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error', or null

  const handleBook = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId,
          availabilityId: availabilityId,
          localDate: "2026-02-05", // Hardcoded for test, make dynamic later
          units: 2, // Booking 2 tickets
          total_price_amount: price * 2,
          status: 'PENDING'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        alert(`Booking Confirmed! ID: ${data.uuid}`);
      } else {
        setStatus('error');
        alert(`Error: ${data.message || 'Booking failed'}`);
      }
    } catch (error) {
      console.error("Booking Error:", error);
      setStatus('error');
      alert("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4 border border-gray-200">
      <div className="text-xl font-medium text-black">Nashik Vineyard Tour</div>
      <p className="text-gray-500">Experience the best wines of India.</p>
      
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-blue-600">${price}</span>
        <span className="text-sm text-gray-500">per person</span>
      </div>

      <button
        onClick={handleBook}
        disabled={loading || status === 'success'}
        className={`w-full py-2 px-4 rounded-md text-white font-semibold transition-colors ${
          loading ? 'bg-gray-400' : 
          status === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Processing...' : status === 'success' ? 'Booked!' : 'Book Now (2 Tickets)'}
      </button>

      {status === 'success' && (
        <p className="text-sm text-green-600 text-center mt-2">
          Check your Supabase: Inventory is now 4!
        </p>
      )}
    </div>
  );
}