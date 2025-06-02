import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../Services/axiosInstance';

const SelectSeats = () => {
    const { screenId } = useParams();
    const [screenData, setScreenData] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScreenData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await axiosInstance.get(`/screens/${screenId}`);
                setScreenData(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch screen data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchScreenData();
    }, [screenId]);

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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-white">
                <div className="text-xl">Loading seat layout...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-white">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        );
    }

    if (!screenData) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-white">
                <div className="text-xl">No seat layout found</div>
            </div>
        );
    }

    return (
        <div className="relative px-4 py-6 text-white bg-dark-primary">
            {/* Selected Seat Counter */}
            <div className="absolute top-4 right-40 text-sm bg-dark-accent text-white px-4 py-2 rounded-lg shadow-lg">
                Selected: {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
            </div>

            {/* Screen Info */}
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold">{screenData.screenName}</h2>
                <p className="text-sm text-gray-400">Total Seats: {screenData.totalSeats}</p>
            </div>

            {/* Seat Layout */}
            <div className="flex flex-col items-center gap-6 mt-10">
                {screenData.layout.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-2">
                        {row.map((seat, seatIndex) => {
                            const isSelected = selectedSeats.includes(seat.seatNumber);
                            const isBooked = seat.isBooked;
                            return (
                                <span
                                    key={seatIndex}
                                    onClick={() => !isBooked && toggleSeat(seat.seatNumber)}
                                    className={`
                                        p-2 h-12 w-12 flex items-center justify-center rounded-sm text-sm
                                        ${isBooked
                                            ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                                            : isSelected
                                                ? 'bg-dark-accent text-white border-dark-accent cursor-pointer'
                                                : 'border-2 border-dark-accent hover:bg-dark-accent/50 cursor-pointer'
                                        }
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
                            : "bg-dark-accent cursor-pointer hover:bg-green-700 text-white"
                        }`}
                >
                    Move to Payment
                </button>
            </div>
        </div>
    );
};

export default SelectSeats;
