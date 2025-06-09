import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../Services/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const SelectSeats = () => {
    const { ScreenId } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn, user } = useAuth();
    const [screenData, setScreenData] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchScreenData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await axiosInstance.get(`/screens/${ScreenId}`);
                setScreenData(response.data.screen);

                // If user is logged in and there are saved seats, restore them
                if (isLoggedIn) {
                    const savedSeats = sessionStorage.getItem('selectedSeats');
                    if (savedSeats) {
                        const { screenId, seats, totalPrice: savedPrice } = JSON.parse(savedSeats);
                        if (screenId === ScreenId) {
                            setSelectedSeats(seats);
                            setTotalPrice(savedPrice);
                            sessionStorage.removeItem('selectedSeats'); // Clear saved seats
                        }
                    }
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch screen data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchScreenData();

        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onerror = () => {
            setError('Failed to load payment gateway. Please refresh the page or try again later.');
        };

        // Add a global error handler for Razorpay initialization errors
        window.addEventListener('error', (event) => {
            if (event.message.includes('Razorpay')) {
                setError('Payment system encountered an error. Please refresh the page.');
                setProcessing(false);
            }
        });

        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [ScreenId, isLoggedIn]);

    const toggleSeat = (seat) => {
        setSelectedSeats(prev => {
            const newSelected = prev.includes(seat.seatNumber)
                ? prev.filter(s => s !== seat.seatNumber)
                : [...prev, seat.seatNumber];

            // Calculate new total price based on row position
            let newTotalPrice = 0;
            screenData.layout.forEach((row, rowIndex) => {
                row.forEach(s => {
                    if (newSelected.includes(s.seatNumber)) {
                        // Premium seats (first two rows) cost 300, others 200
                        newTotalPrice += rowIndex < 2 ? 300 : 200;
                    }
                });
            });

            setTotalPrice(newTotalPrice);
            return newSelected;
        });
    };

    const handlePayment = async () => {
        if (!isLoggedIn) {
            // Save current selection before redirecting
            sessionStorage.setItem('selectedSeats', JSON.stringify({
                screenId: ScreenId,
                seats: selectedSeats,
                totalPrice: totalPrice
            }));
            navigate('/login', { state: { returnTo: `/selectseats/${ScreenId}` } });
            return;
        }

        if (!window.Razorpay) {
            setError('Payment gateway is not available. Please refresh the page.');
            return;
        }

        try {
            setProcessing(true);
            // Create order on server (using ₹1 for testing)
            const orderResponse = await axiosInstance.post('/payment/create-order', {
                amount: 1  // For testing, actual amount would be totalPrice
            });

            if (!orderResponse.data.success) {
                throw new Error('Could not create order');
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: 100, // amount in paisa (₹1)
                currency: "INR",
                name: "Movie Square",
                description: `Booking ${selectedSeats.length} seats`,
                order_id: orderResponse.data.order.id,
                handler: async function (response) {
                    try {
                        const verifyResponse = await axiosInstance.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            seats: selectedSeats,
                            screenId: ScreenId,
                            amount: totalPrice
                        });

                        if (verifyResponse.data.success) {
                            // Create booking
                            const bookingResponse = await axiosInstance.post('/bookings/create', {
                                screenId: ScreenId,
                                seats: selectedSeats,
                                totalAmount: 1, // ₹1 for testing
                                paymentId: response.razorpay_payment_id,
                                isConfirmed: true
                            });

                            if (bookingResponse.data.success) {
                                // Show success message and redirect
                                const message = document.createElement('div');
                                message.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in-out';
                                message.textContent = 'Booking successful! Redirecting to tickets...';
                                document.body.appendChild(message);

                                // Remove message after navigation
                                setTimeout(() => {
                                    document.body.removeChild(message);
                                    navigate('/tickets');
                                }, 2000);
                            } else {
                                throw new Error('Booking creation failed');
                            }
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    } catch (err) {
                        console.error('Payment verification/booking error:', err);
                        const errorMsg = err.response?.data?.message || 'Payment processing failed';

                        // Show error toast
                        const errorToast = document.createElement('div');
                        errorToast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in-out';
                        errorToast.textContent = errorMsg;
                        document.body.appendChild(errorToast);

                        // Remove error toast after 3 seconds
                        setTimeout(() => {
                            document.body.removeChild(errorToast);
                        }, 3000);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setProcessing(false);
                    }
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                    contact: user?.phone || ""
                },
                theme: {
                    color: "#3B82F6"
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (err) {
            console.error('Payment initialization error:', err);
            setProcessing(false);

            // Show error toast
            const errorToast = document.createElement('div');
            errorToast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in-out';
            errorToast.textContent = err.response?.data?.message || 'Could not initialize payment';
            document.body.appendChild(errorToast);

            // Remove error toast after 3 seconds
            setTimeout(() => {
                document.body.removeChild(errorToast);
            }, 3000);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-dark-primary text-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-dark-accent mb-4"></div>
                <div className="text-dark-accent font-semibold text-xl">Loading seat layout...</div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-dark-primary text-white">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <div className="text-xl text-red-500 mb-2">Oops! Something went wrong</div>
                <div className="text-gray-400 mb-4">{error}</div>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-dark-accent text-white px-6 py-2 rounded-lg hover:bg-dark-accent/80 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // No data state
    if (!screenData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-dark-primary text-white">
                <div className="text-6xl mb-4">🎬</div>
                <div className="text-xl mb-2">No seat layout found</div>
                <div className="text-gray-400 mb-4">The screen you're looking for might have been moved or deleted.</div>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-dark-accent text-white px-6 py-2 rounded-lg hover:bg-dark-accent/80 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="relative px-4 py-6 text-white bg-dark-primary">
            {/* Selected Seat Counter and Price */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 md:flex-row md:gap-4">
                <div className="text-sm bg-dark-accent text-white px-4 py-2 rounded-lg shadow-lg">
                    Selected: {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
                </div>
                <div className="text-sm bg-dark-secondary text-white px-4 py-2 rounded-lg shadow-lg">
                    Total: ₹{totalPrice}
                </div>
            </div>

            {/* Screen Info */}
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold">{screenData.screenName}</h2>
                <p className="text-sm text-gray-400">Total Seats: {screenData.totalSeats}</p>
            </div>

            {/* Price Legend */}
            <div className="flex justify-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-500 rounded-sm"></span>
                    <span className="text-sm">Premium (₹300)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-blue-500 rounded-sm"></span>
                    <span className="text-sm">Standard (₹200)</span>
                </div>
            </div>

            {/* Seat Layout */}
            <div className="flex flex-col items-center gap-6 mt-10">
                {screenData.layout.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-2">
                        {row.map((seat, seatIndex) => {
                            const isSelected = selectedSeats.includes(seat.seatNumber);
                            const isBooked = seat.isBooked;
                            const isPremium = rowIndex < 2; // First two rows are premium

                            return (
                                <div key={seatIndex} className="relative group">
                                    <span
                                        onClick={() => !isBooked && toggleSeat(seat)}
                                        className={`
                                                p-2 h-12 w-12 flex items-center justify-center rounded-sm text-sm
                                                ${isBooked
                                                ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                                                : isSelected
                                                    ? 'bg-dark-accent text-white border-dark-accent cursor-pointer'
                                                    : `border-2 cursor-pointer ${isPremium
                                                        ? 'border-green-500 hover:bg-green-500/50'
                                                        : 'border-blue-500 hover:bg-blue-500/50'
                                                    }`
                                            }
                                            `}
                                    >
                                        {seat.seatNumber}
                                    </span>
                                    {/* Price tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-dark-secondary rounded text-xs
                                            opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                        ₹{isPremium ? '300' : '200'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}

                {/* Screen Line */}
                <div className="mt-8 text-center w-full">
                    <div className="w-full max-w-2xl mx-auto h-2 bg-gray-300 rounded-lg mb-1"></div>
                    <span className="text-sm text-gray-400">SCREEN</span>
                </div>

                {/* Move to Payment */}
                <button
                    disabled={selectedSeats.length === 0 || processing}
                    onClick={handlePayment}
                    className={`
                        mt-10 font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200 
                        flex items-center justify-center gap-2
                        ${selectedSeats.length === 0 || processing
                            ? "bg-gray-400 cursor-not-allowed text-white"
                            : "bg-dark-accent cursor-pointer hover:bg-dark-accent/80 text-white"
                        }
                    `}
                >
                    {processing ? (
                        <>
                            <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                            <span>Processing...</span>
                        </>
                    ) : isLoggedIn ? (
                        <>
                            <span>Pay ₹{totalPrice}</span>
                            <span className="text-sm">(Test: ₹1)</span>
                        </>
                    ) : (
                        <>
                            <span className="material-icons-outlined text-xl">login</span>
                            <span>Login to Continue</span>
                        </>
                    )}
                </button>

                {/* Price Info */}
                <div className="mt-4 text-center text-gray-400 text-sm">
                    For testing, all payments are set to ₹1
                </div>
            </div>
        </div>
    );
};

export default SelectSeats;
