import React, { useState } from 'react';
import axiosInstance from '../../Services/axiosInstance';

const Screens = {
    name: "Audi 1",
    totalSeats: 20,
    layout: [
        [
            { seatNumber: "A1", seatType: "Premium", available: true },
            { seatNumber: "A2", seatType: "Premium", available: true },
            { seatNumber: "A3", seatType: "Premium", available: true },
            { seatNumber: "A4", seatType: "Premium", available: true },
            { seatNumber: "A5", seatType: "Premium", available: true },
            { seatNumber: "A6", seatType: "Premium", available: true },
            { seatNumber: "A7", seatType: "Premium", available: true },
            { seatNumber: "A8", seatType: "Premium", available: true },
            { seatNumber: "A9", seatType: "Premium", available: true },
            { seatNumber: "A10", seatType: "Premium", available: true },
        ],
        [
            { seatNumber: "B1", seatType: "Regular", available: true },
            { seatNumber: "B2", seatType: "Regular", available: true },
            { seatNumber: "B3", seatType: "Regular", available: true },
            { seatNumber: "B4", seatType: "Regular", available: true },
            { seatNumber: "B5", seatType: "Regular", available: true },
            { seatNumber: "B6", seatType: "Regular", available: true },
            { seatNumber: "B7", seatType: "Regular", available: true },
            { seatNumber: "B8", seatType: "Regular", available: true },
            { seatNumber: "B9", seatType: "Regular", available: true },
            { seatNumber: "B10", seatType: "Regular", available: true },
        ]
    ]
};

const SelectSeats = () => {
    const { layout } = Screens;
    const [selectedSeats, setSelectedSeats] = useState([]);

    const toggleSeat = (seatNumber) => {
        setSelectedSeats(prev =>
            prev.includes(seatNumber)
                ? prev.filter(s => s !== seatNumber)
                : [...prev, seatNumber]
        );
    };

    const handlePayment = () => {
        console.log("Proceeding to payment with:", selectedSeats);
    };

    return (
        <div className="relative px-4 py-6 text-white bg-dark-primary">
            {/* Selected Seat Counter */}
            <div className="absolute top-4 right-40 text-sm bg-dark-accent text-white px-4 py-2 rounded-lg shadow-lg">
                Selected: {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
            </div>

            {/* Seat Layout */}
            <div className="flex flex-col items-center gap-6 mt-10">
                {layout.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-2">
                        {row.map((seat, seatIndex) => {
                            const isSelected = selectedSeats.includes(seat.seatNumber);
                            return (
                                <span
                                    key={seatIndex}
                                    onClick={() => toggleSeat(seat.seatNumber)}
                                    className={`
                    p-2 h-12 w-12 flex items-center justify-center rounded-sm text-sm cursor-pointer
                    border-2
                    ${isSelected ? 'bg-dark-accent text-white border-dark-accent' : 'border-dark-accent hover:bg-dark-accent/50'}
`}
                                >
                                    {seat.seatNumber}
                                </span>
                            );
                        })}
                    </div>
                ))}

                {/* Screen Line */}
                <div className="mt-8 text-center">
                    <div className="w-100 h-2 bg-gray-300 mb-1"></div>
                    <span className="text-sm text-gray-400">SCREEN</span>
                </div>

                {/* Move to Payment */}

                <button
                    disabled={selectedSeats.length === 0}
                    onClick={handlePayment}
                    className={`mt-10 font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200 
    ${selectedSeats.length === 0
                            ? "bg-gray-400 cursor-not-allowed text-white"
                            : "bg-dark-accent cursor-pointer hover:bg-green-700 text-white"}`}
                >
                    Move to Payment
                </button>

            </div>
        </div>
    );
};

export default SelectSeats;
