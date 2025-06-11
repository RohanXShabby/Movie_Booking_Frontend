import { useParams, useLoaderData, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaTicketAlt, FaInfoCircle } from 'react-icons/fa'; // FaTicketAlt is imported but not used, can be removed if not needed

const SelectTheater = () => {
    const { id } = useParams(); // Movie ID from URL parameters
    const theaters = useLoaderData(); // Data loaded for available shows and theaters
    const [selected, setSelected] = useState({ theaterId: null, showId: null }); // State to track selected show time

    // Initialize grouped object. Add a check for `theaters` before attempting to iterate.
    const grouped = {};
    if (theaters && Array.isArray(theaters)) { // Ensure theaters is an array before processing
        theaters.forEach(show => {
            // Handle cases where theaterId might be an object or just an ID string
            const tId = show.theaterId?._id || show.theaterId;
            // Ensure tId is not null/undefined before using as a key
            if (tId) {
                if (!grouped[tId]) {
                    grouped[tId] = {
                        theater: show.theaterId, // Keep the full theater object if available
                        shows: []
                    };
                }
                grouped[tId].shows.push(show);
            } else {
                // Log if a show has no valid theaterId to help debugging data issues
                console.warn("Show object found with no valid theaterId:", show);
            }
        });
    } else {
        console.warn("Loader data for theaters is not an array or is null/undefined:", theaters);
    }

    // Convert grouped object to an array for mapping
    const groupedTheaters = Object.values(grouped);

    // Effect to reset selection when movie ID changes (navigating to another movie)
    useEffect(() => {
        setSelected({ theaterId: null, showId: null });
    }, [id]);

    return (
        <div className="min-h-screen bg-dark-primary text-dark-text p-4 md:p-8 lg:p-12 xl:p-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-dark-text animate-fade-in-down">
                Select Your Show
            </h2>

            {groupedTheaters.length === 0 && (
                <div className="text-center text-dark-text text-lg py-10 rounded-lg bg-dark-secondary/30 shadow-lg">
                    No theaters found for this movie today. Please check back later!
                </div>
            )}

            <div className="flex flex-col gap-10">
                {groupedTheaters.map((group, i) => (
                    // Each theater block
                    <div
                        // Ensure a stable key; fallback to index only if _id is truly unavailable and you're certain the order won't change
                        key={group.theater?._id || `theater-group-${i}`}
                        className="bg-dark-secondary p-6 rounded-xl shadow-xl border border-dark-accent/30 transform hover:scale-[1.005] transition-transform duration-300 ease-in-out"
                    >
                        {/* Theater Name and Address */}
                        <div className="flex items-center gap-4 mb-6">
                            <FaMapMarkerAlt className="text-dark-accent w-7 h-7 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-2xl leading-tight text-dark-text">
                                    {group.theater?.name || 'Unknown Theater'} {/* Added fallback text */}
                                </h3>
                                <div className="text-dark-text text-sm md:text-base flex flex-wrap gap-x-2 items-center mt-1">
                                    <span>{group.theater?.address || 'Address not available'}</span> {/* Added fallback text */}
                                    {/* Check if cancellationAllowed exists and is true before rendering */}
                                    {group.theater?.cancellationAllowed && (
                                        <>
                                            <span className="mx-1 hidden sm:inline">|</span>
                                            <span className="flex items-center gap-1 text-green-400">
                                                <FaInfoCircle className="w-4 h-4" /> Allows cancellation
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Show Times */}
                        <div className="flex flex-wrap gap-4 mt-4">
                            {group.shows.map((show) => {
                                const theaterResolvedId = group.theater?._id || group.theater;
                                const isSelected = selected.theaterId === theaterResolvedId && selected.showId === show._id;
                                const screenId = show.screenId?._id || show.screenId; // Ensure screenId is correctly retrieved

                                // Add a check to ensure essential show properties exist before rendering the Link
                                if (!show.time || !show._id || !screenId) {
                                    console.warn("Skipping malformed show data:", show);
                                    return null; // Don't render if essential data is missing
                                }

                                return (
                                    <Link
                                        // Ensure all parts of the 'to' path are defined
                                        to={`/movies/book-tickets/${id}/${theaterResolvedId}/${screenId}/${show._id}`}
                                        key={show._id}
                                        onClick={() => setSelected({ theaterId: theaterResolvedId, showId: show._id })}
                                        className={`
                                            cursor-pointer px-6 py-3 rounded-lg font-semibold text-lg flex flex-col items-center justify-center min-w-[120px] shadow-md
                                            transition-all duration-300 ease-in-out border-2
                                            ${isSelected
                                                ? 'bg-dark-accent text-dark-primary border-dark-accent' // Selected state
                                                : 'bg-dark-primary text-dark-text border-dark-secondary hover:bg-dark-accent/80 hover:text-dark-primary hover:border-dark-accent' // Unselected state
                                            }
                                        `}
                                    >
                                        <span className="text-xl">{show.time}</span>
                                        {show.format && (
                                            <span className="text-xs font-normal text-dark-text/70 mt-1">
                                                {show.format}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SelectTheater;
